function createObjectFromGCode(gcode) {
  // GCode descriptions come from:
  //    http://reprap.org/wiki/G-code
  //    http://en.wikipedia.org/wiki/G-code
  //    SprintRun source code

  var lastLine = {x:0, y:0, z:0, e:0, f:0, rapid:false, extruding:false, rot_axis:"z"};

  var layers = [];
  var layer = undefined;
  var bbbox = { min: { x:100000,y:100000,z:100000 }, max: { x:-100000,y:-100000,z:-100000 } };

  function newLayer(line) {
     layer = { type: {}, layer: layers.count(), z: line.z, };
     layers.push(layer);
  }
  function getLineGroup(line) {
     if (layer == undefined)
       newLayer(line);
     var speed = Math.round(line.e / 1000);
     //var grouptype = (line.extruding ? 10000 : 0) + speed;
     var grouptype = (line.rapid ? 10000 : 0) ;
     //var color = new THREE.Color(line.extruding ? 0xffffff : 0x0000ff);
     //var color = new THREE.Color(line.rapid ? 0xffffff : 0x0000ff);
     var color = new THREE.Color(line.rapid ? 0x0000ff : 0xffffff );
     if (layer.type[grouptype] == undefined) {
       layer.type[grouptype] = {
         type: grouptype,
         feed: line.e,
         extruding: line.extruding,
                rapid: line.rapid,
         color: color,
         segmentCount: 0,
         material: new THREE.LineBasicMaterial({
            //opacity:line.extruding ? 0.5 : 0.4,
            opacity:line.rapid ? 0.2 : 0.5,
            transparent: true,
            linewidth: 1,
            vertexColors: THREE.FaceColors }),
        geometry: new THREE.Geometry(),
      }
    }
    return layer.type[grouptype];
  }
  function addSegment(p1, p2) {
    var group = getLineGroup(p2);
    var geometry = group.geometry;

    group.segmentCount++;
    //geometry.vertices.push(new THREE.Vertex(
    //    new THREE.Vector3(p1.x, p1.y, p1.z)));
    geometry.vertices.push( new THREE.Vector3(p1.x, p1.y, p1.z ));

    //geometry.vertices.push(new THREE.Vertex(
    //    new THREE.Vector3(p2.x, p2.y, p2.z)));
    geometry.vertices.push( new THREE.Vector3(p2.x, p2.y, p2.z ));

    geometry.colors.push(group.color);
    geometry.colors.push(group.color);
    if (p2.extruding) {
      bbbox.min.x = Math.min(bbbox.min.x, p2.x);
      bbbox.min.y = Math.min(bbbox.min.y, p2.y);
      bbbox.min.z = Math.min(bbbox.min.z, p2.z);
      bbbox.max.x = Math.max(bbbox.max.x, p2.x);
      bbbox.max.y = Math.max(bbbox.max.y, p2.y);
      bbbox.max.z = Math.max(bbbox.max.z, p2.z);
    }
  }
  var relative = false;
  function delta(v1, v2) {
    return relative ? v2 : v2 - v1;
  }
  function absolute (v1, v2) {
    return relative ? v1 + v2 : v2;
  }

  function addLinearizedArcLines(args, d0, d1, d2, cw_flag) {
    var n_seg = 16;
    var rot_sign = ((cw_flag === "undefined") ? 1 : (cw_flag ? -1 : 1));

    var orig_d0 = lastLine[d0];
    var orig_d1 = lastLine[d1];
    var cor_d0 = lastLine[d0] + args.i;
    var cor_d1 = lastLine[d1] + args.j;
    var orig_d2 = lastLine[d2];
    var dst_d2 = ((args[d2] !== undefined) ? absolute(lastLine[d2], args[d2]) : lastLine[d2]);
    var r = Math.sqrt( ((cor_d0 - orig_d0)*(cor_d0 - orig_d0)) + ((cor_d1 - orig_d1)*(cor_d1 - orig_d1)) );
    var ang_s = Math.atan2( lastLine[d1] - cor_d1, lastLine[d0] - cor_d0 );
    var ang_e = Math.atan2( args[d1] - cor_d1, args[d0] - cor_d0 );
    var ang_del = ang_e - ang_s;
    if (ang_del < 0) { ang_del += Math.PI*2.0; }
    if (ang_del < 0) { ang_del += Math.PI*2.0; }
    if (ang_del > (2.0*Math.PI)) { ang_del -= Math.PI*2.0; }
    if (ang_del > (2.0*Math.PI)) { ang_del -= Math.PI*2.0; }
    for (var i=0; i<(n_seg+1); i++) {
      var f = i/n_seg;

      var nl = {
        x: 0,
        y: 0,
        z: 0,
        e: lastLine.e,
        f: args.f !== undefined ? absolute(lastLine.f, args.f) : lastLine.f,
        rapid: false
      };
      nl[d0] = cor_d0 + r*Math.cos( rot_sign*((f*ang_del) + ang_s) );
      nl[d1] = cor_d1 + r*Math.sin( rot_sign*((f*ang_del) + ang_s) );
      nl[d2] = orig_d2 + f*(dst_d2 - orig_d2);

      addSegment(lastLine, nl);
      lastLine = nl;
    }

    return;
  }



  var parser = new GCodeParser({
    G0: function(args, line) {
      // Example: G0 Z1.0 F3000
      //          G0 X99.9948 Y80.0611 Z15.0 F1500.0 E981.64869
      //          G0 E104.25841 F1800.0
      // Go in a straight line from the current (X, Y) point
      // to the point (90.6, 13.8), extruding material as the move
      // happens from the current extruded length to a length of
      // 22.4 mm.

      var newLine = {
        x: args.x !== undefined ? absolute(lastLine.x, args.x) : lastLine.x,
        y: args.y !== undefined ? absolute(lastLine.y, args.y) : lastLine.y,
        z: args.z !== undefined ? absolute(lastLine.z, args.z) : lastLine.z,
        e: args.e !== undefined ? absolute(lastLine.e, args.e) : lastLine.e,
        f: args.f !== undefined ? absolute(lastLine.f, args.f) : lastLine.f,
        rapid: true,
      };
      /* layer change detection is or made by watching Z, it's made by
         watching when we extrude at a new Z position */
      if (delta(lastLine.e, newLine.e) > 0)
      {
        newLine.extruding = delta(lastLine.e, newLine.e) > 0;
        if (layer == undefined || newLine.z != layer.z)
        {
          newLayer(newLine);
        }
      }
      addSegment(lastLine, newLine);
      lastLine = newLine;
    },

    G1: function(args, line) {
      // Example: G1 Z1.0 F3000
      //          G1 X99.9948 Y80.0611 Z15.0 F1500.0 E981.64869
      //          G1 E104.25841 F1800.0
      // Go in a straight line from the current (X, Y) point
      // to the point (90.6, 13.8), extruding material as the move
      // happens from the current extruded length to a length of
      // 22.4 mm.

      var newLine = {
        x: args.x !== undefined ? absolute(lastLine.x, args.x) : lastLine.x,
        y: args.y !== undefined ? absolute(lastLine.y, args.y) : lastLine.y,
        z: args.z !== undefined ? absolute(lastLine.z, args.z) : lastLine.z,
        e: args.e !== undefined ? absolute(lastLine.e, args.e) : lastLine.e,
        f: args.f !== undefined ? absolute(lastLine.f, args.f) : lastLine.f,
        rapid: false,
      };
      /* layer change detection is or made by watching Z, it's made by
         watching when we extrude at a new Z position */
      if (delta(lastLine.e, newLine.e) > 0) {
        newLine.extruding = delta(lastLine.e, newLine.e) > 0;
        if (layer == undefined || newLine.z != layer.z)
        {
          newLayer(newLine);
        }
      }
      addSegment(lastLine, newLine);
      lastLine = newLine;
    },

    // clockwise arc
    //
    G2: function(args) {
      var n_eg = 16;
      if (args.type == "radius-format-arc") {
        console.log("rfa g2", args.x, args.y, args.c, args.r);
      }
      else if (args.type == "center-format-arc") {
        console.log("cfa g2", args.x, args.y, args.i, args.j);
  			addLinearizedArcLines(args, "x", "y", "z", true);
      }
    },

    // counterclockwise arc
    //
    G3: function(args) {
      if (args.type == "radius-format-arc") {
        console.log("rfa g3", args.x, args.y, args.c, args.r);
      }
      else if (args.type == "center-format-arc") {
        //console.log("cfa g3", args.x, args.y, args.i, args.j);
  			addLinearizedArcLines(args, "x", "y", "z", false);
      }
    },

    G4: function(args) {
      // G04: dwell
      // ignore
    },

    G04: function(args) {
      // G04: dwell
      // ignore
    },

    G17: function(args) {
      lastLine.rot_axis = "z";
    },

    G18: function(args) {
      lastLine.rot_axis = "y";
    },

    G19: function(args) {
      lastLine.rot_axis = "x";
    },



    G40: function(args) {
      // G40: cutter radius compensation off
      // ignore
      console.log("g40");
    },

    G41: function(args) {
      // G41: cutter radius compensation on?
      // ignore
    },

    G42: function(args) {
      // G42: cutter radius compensation on?
      // ignore
    },

    G49: function(args) {
      // G49: tool length offset compensation cancel
      // ignore
    },

    G54: function(args) {
      // G54: work co-ordinate system?
      // ignore
    },

    G61: function(args) {
      // G61: exact stop check, modal (?)
      // ignore
    },

    G80: function(args) {
      // G80: cancel canned cycle (?_
      // ignore
    },

    G20: function(args) {
      // G20: Set Units to Inches
      // Example: G20
      // Units from now on are in Inches.

      console.log("g20", args);

    },

    G21: function(args) {
      // G21: Set Units to Millimeters
      // Example: G21
      // Units from now on are in millimeters. (This is the RepRap default.)

      // No-op: So long as G20 is not supported.
      console.log("g21");
    },

    G90: function(args) {
      // G90: Set to Absolute Positioning
      // Example: G90
      // All coordinates from now on are absolute relative to the
      // origin of the machine. (This is the RepRap default.)

      console.log("g90");

      relative = false;
    },

    G91: function(args) {
      // G91: Set to Relative Positioning
      // Example: G91
      // All coordinates from now on are relative to the last position.

      // TODO!
      console.log("g91");

      relative = true;
    },

    G92: function(args) { // E0
      // G92: Set Position
      // Example: G92 E0
      // Allows programming of absolute zero point, by reseting the
      // current position to the values specified. This would set the
      // machine's X coordinate to 10, and the extrude coordinate to 90.
      // No physical motion will occur.

      // TODO: Only support E0
      var newLine = lastLine;
      newLine.x= args.x !== undefined ? args.x : newLine.x;
      newLine.y= args.y !== undefined ? args.y : newLine.y;
      newLine.z= args.z !== undefined ? args.z : newLine.z;
      newLine.e= args.e !== undefined ? args.e : newLine.e;
      lastLine = newLine;
    },

    M82: function(args) {
      // M82: Set E codes absolute (default)
      // Descriped in Sprintrun source code.

      // No-op, so long as M83 is not supported.
    },

    M84: function(args) {
      // M84: Stop idle hold
      // Example: M84
      // Stop the idle hold on all axis and extruder. In some cases the
      // idle hold causes annoying noises, which can be stopped by
      // disabling the hold. Be aware that by disabling idle hold during
      // printing, you will get quality issues. This is recommended only
      // in between or after printjobs.

      // No-op
    },

    S: function(args) {
      console.log(">>> s", args.S);
    },

    F: function(args) {
      console.log(">>> f", args.F);
    },

    T: function(args) {
      console.log(">> tool change (T)", args);
    },

    M: function(args) {
      var v = args.value;
      if      (v == 0)  { console.log(">>> m program stop"); }
      if      (v == 1)  { console.log(">>> m program opttional stop"); }
      if      (v == 2)  { console.log(">>> m program end"); }
      else if (v == 3)  { console.log(">>> m spindle on (cw)"); }
      else if (v == 4)  { console.log(">>> m spindle on (ccw)"); }
      else if (v == 5)  { console.log(">>> m stop spindle"); }
      else if (v == 6)  { console.log(">>> m tool change"); }
      else if (v == 7)  { console.log(">>> m mist coolat on"); }
      else if (v == 8)  { console.log(">>> m flood coolant on"); }
      else if (v == 9)  { console.log(">>> m mist and flood coolant off"); }
      else if (v == 30) { console.log(">>> m program end, pallet shuttle, reset"); }
      else if (v == 48) { console.log(">>> m enable speed/feed overrides"); }
      else if (v == 49) { console.log(">>> m disable speed/feed overrides"); }
      else if (v == 60) { console.log(">>> m pallet shuttle and program stop"); }
      else              { console.log(">>> m unknown command"); }
    },


    'default': function(args, info) {
      console.error('Unknown command:', "'" + args.cmd + "'", args, info);
    }
  });

  parser.parse(gcode);

  console.log("Layer Count ", layers.count());

  var object = new THREE.Object3D();

  for (var lid in layers) {
    var layer = layers[lid];
    for (var tid in layer.type) {
      var type = layer.type[tid];
      object.add(new THREE.Line(type.geometry, type.material, THREE.LinePieces));
    }
  }
  console.log("bbox ", bbbox);

  // Center
  //
  var scale = 3; // TODO: Auto size

  var center = new THREE.Vector3(
      bbbox.min.x + ((bbbox.max.x - bbbox.min.x) / 2),
      bbbox.min.y + ((bbbox.max.y - bbbox.min.y) / 2),
      bbbox.min.z + ((bbbox.max.z - bbbox.min.z) / 2));

  console.log("center ", center);

  object.position = center.multiplyScalar(-scale);

  object.scale.multiplyScalar(scale);

  return object;
}
