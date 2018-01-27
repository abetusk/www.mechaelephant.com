/**
 * Parses a string of gcode instructions, and invokes handlers for
 * each type of command.
 *
 * Special handler:
 *   'default': Called if no other handler matches.
 */
function GCodeParser(handlers) {
  this.handlers = handlers || {};
}

var parser_state = { "last_motion" : "G0" };

GCodeParser.prototype.handleMultipleCommands = function(text, info) {
  var last_ret = false;
  var sub_cmds = text.split(' G');

  console.log("... handle multiple");

  for (var i=0; i<sub_cmds.length; i++) {

    var sub_text = sub_cmds[i];
    if (i>0) { sub_text = "G" + sub_text; }
    var tokens = sub_text.split(' ');
    var args = {};

    if (tokens) {
      var cmd = tokens[0];
      var args = {};

      if (cmd.length>0) {
        if ((cmd[0] == 'F') || 
            (cmd[0] == 'S') ||
            (cmd[0] == 'T') ||
            (cmd[0] == 'M')) {
          args = { 'cmd' : cmd[0] };
          var value = parseFloat(cmd.substring(1));
          args[cmd[0]] = value;
          args["value"] = value;
          cmd = cmd[0];
        } else {
          args = { 'cmd': cmd };
        }

      }

      if ((cmd == "G2") || (cmd == "G3")) {
        if (text.match( /R/)) { args.type = "radius-format-arc"; }
        else                  { args.type = "center-format-arc"; }
      }

      tokens.splice(1).forEach(function(token) {
        if (token.length==0) { return; }

        var key = token[0].toLowerCase();
        var value = parseFloat(token.substring(1));
        args[key] = value;
      });

      var handler = this.handlers[cmd] || this.handlers['default'];
      if (handler) {
        last_ret = handler(args, info);
      }

    }

  }

  return last_ret;
}

GCodeParser.prototype.parseLine = function(text, info) {
  text = text.replace(/;.*$/, '').trim(); // Remove comments

  //not perfect, but just to get something working
  //

  // get rid of comments
  //
  text = text.replace(/\([^\)]*\)/, '').trim();

  // capitalize g0 and g1
  //
  text = text.replace(/^\s*g\s*0\s/, 'G0 ').trim();
  text = text.replace(/^\s*G\s*00/, 'G0 ').trim();

  text = text.replace(/^\s*g\s*1\s/, 'G1 ').trim();
  text = text.replace(/^\s*G\s*01/, 'G1 ').trim();

  text = text.replace(/^\s*g\s*2\s/, 'G2 ').trim();
  text = text.replace(/^\s*G\s*02/, 'G2 ').trim();

  text = text.replace(/^\s*g\s*3\s/, 'G3 ').trim();
  text = text.replace(/^\s*G\s*03/, 'G3 ').trim();

  text = text.replace(/g/, 'G').trim();
  text = text.replace(/t/, 'T').trim();

  text = text.replace(/\s*[xX]\s*/, ' X').trim();
  text = text.replace(/\s*[yY]\s*/, ' Y').trim();
  text = text.replace(/\s*[zZ]\s*/, ' Z').trim();
  text = text.replace(/\s*[iI]\s*/, ' I').trim();
  text = text.replace(/\s*[jJ]\s*/, ' J').trim();
  text = text.replace(/\s*[rR]\s*/, ' R').trim();
  text = text.replace(/\s*[mM]\s*/, ' M').trim();

  text = text.replace(/\s*[sS]\s*(\d+(\.\d+)?)?\s*/, " S$1").trim();;

  text = text.replace(/\s*[fF]\s*(\d+(\.\d+)?)?\s*/, " F$1").trim();;

  if (text.match( /[XYZ]/ )) {
    if (!text.match( /^\s*G/)) {
      text = parser_state.last_motion + " " + text;
    }
  }

  if (text.match( /G0\s/ )) {
    parser_state.last_motion = "G0";
  }

  if (text.match( /G1\s/ )) {
    parser_state.last_motion = "G1";
  }

  if (text.match( /G2\s/ )) {
    parser_state.last_motion = "G2";
  }

  if (text.match( /G3\s/ )) {
    parser_state.last_motion = "G3";
  }

  text = text.replace(/  */, ' ').trim();

  if (text) {

    var sub_cmds = text.split(' G');
    if (sub_cmds.length > 1) {
      return this.handleMultipleCommands(text, info);
    }

    var tokens = text.split(' ');

    if (tokens) {
      var cmd = tokens[0];
      var args = {};

      if (cmd.length>0) {
        if ((cmd[0] == 'F') || 
            (cmd[0] == 'S') ||
            (cmd[0] == 'T') ||
            (cmd[0] == 'M')) {
          args = { 'cmd' : cmd[0] };
          var value = parseFloat(cmd.substring(1));
          args[cmd[0]] = value;
          args["value"] = value;
          cmd = cmd[0];
        } else {
          args = { 'cmd': cmd };
        }

      }
 
      if ((cmd == "G2") || (cmd == "G3")) {
        if (text.match( /R/)) { args.type = "radius-format-arc"; }
        else                  { args.type = "center-format-arc"; }
      }

      tokens.splice(1).forEach(function(token) {
        if (token.length==0) { return; }

        var key = token[0].toLowerCase();
        var value = parseFloat(token.substring(1));
        args[key] = value;
      });

      var handler = this.handlers[cmd] || this.handlers['default'];
      if (handler) {
        return handler(args, info);
      }
    }

  }
};

GCodeParser.prototype.parse = function(gcode) {
  var lines = gcode.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (this.parseLine(lines[i], i) === false) {
      break;
    }
  }
};
