
var g_notenox = {
  "db":{},
  "graph": {
    "keyword":{},
    "title": {}
  },
  "freq" : {
    "keyword":{},
    "title":{}
  }
};


// --------------
// --------------
// --------------

// update functions

function _div() { return document.createElement("div"); }
function _h1() { return document.createElement("h1"); }
function _h2() { return document.createElement("h2"); }
function _h3() { return document.createElement("h3"); }
function _h4() { return document.createElement("h4"); }
function _h5() { return document.createElement("h5"); }
function _h6() { return document.createElement("h6"); }
function _p() { return document.createElement("p"); }
function _a(txt,href) {
  var a = document.createElement("a");
  if (typeof txt !== "undefined") {
    a.appendChild( _text(txt) );
  }
  if (typeof href !== "undefined") {
    a.href = href;
  }
  return a;
}
function _small() { return document.createElement("small"); }
function _text(txt) { return document.createTextNode(txt); }
function _hr() { return document.createElement("hr");  }
function _br() { return document.createElement("br");  }
function _td() { return document.createElement("td");  }
function _tr() { return document.createElement("tr");  }



function notenox_viewer_ui_keyword(kw) {
  notenox_viewer_ui_update( notenox_viewer_filter_keyword(kw), "keyword:" + kw );
}

function notenox_viewer_ui_title(title) {
  notenox_viewer_ui_update( notenox_viewer_filter_title(title), title );
}

function notenox_viewer_ui_all() {
  notenox_viewer_ui_update( notenox_viewer_filter_all() );
}

function notenox_viewer_ui_update(filter_list, section_title) {

  console.log(">>>", filter_list, section_title);

  section_title = ((typeof section_title === "undefined") ? "" : section_title);

  var _sec = document.getElementById("notenox-ui-section");
  _sec.innerHTML = '';

  if (section_title.length > 0) {
    var h1 = _h1();
    h1.appendChild( _text(section_title) );
    _sec.appendChild(h1);
  }

  var ele = filter_list;
  for (var ii=0; ii<ele.length; ii++) {

    var _nod = ele[ii];

    var html_ele = _div();

    var h6 = _h6();
    var t = new Date(1970,0,1);
    t.setSeconds( Math.floor(_nod.timestamp) );
    h6.appendChild( _text( t.toISOString().replace(/[TZ]/g, ' ').replace( /\..*/, '') ) );
    html_ele.appendChild(h6);

    var p ;
    //var p = _p();

    //p.appendChild( _text( _nod.note ) );
    //var raw_note = _nod.note;

    var note_a = _nod.note.split(/\n/);
    for (var _n=0; _n<note_a.length; _n++) {
      var p = _p();
      p.appendChild( _text(note_a[_n]) );
      html_ele.appendChild( p );
    }

    p = _p();
    for (var jj=0; jj<_nod.link.length; jj++) {
      p.appendChild( _text(" (") );
      p.appendChild( _a( "link", _nod.link[jj] ) );
      p.appendChild( _text(")") );
    }
    html_ele.appendChild( p );

    var s = _small();
    s.appendChild( _a( _nod.id, "#id=" + _nod.id ) );
    html_ele.appendChild(s);

    html_ele.appendChild(_br());

    var s = _small();
    for (var jj=0; jj<_nod.keyword.length; jj++) {
      if (jj>0) {
        s.appendChild( _text(", ") );
      }

      var kwlink = _a( _nod.keyword[jj], "#keyword=" + _nod.keyword[jj] );
      kwlink.onclick = (function(__x) {
        return function() { notenox_viewer_ui_keyword(__x); };
      })( _nod.keyword[jj] );
      s.appendChild(kwlink);


    }
    html_ele.appendChild(s);

    if (ii > 0) {
      _sec.appendChild( _hr() );
    }
    _sec.appendChild( html_ele );

  }

}

// --------------
// --------------
// --------------

// filter functions
// - returns arrays of filtered data

function _timestamp_asc(x,y) {
  if (x.timestamp < y.timestamp) { return -1; }
  if (x.timestamp > y.timestamp) { return  1; }
  return 0;
}

function _timestamp_desc(x,y) {
  if (x.timestamp > y.timestamp) { return -1; }
  if (x.timestamp < y.timestamp) { return  1; }
  return 0;
}

function notenox_viewer_filter_all(_dat) {
  _dat = ( (typeof _dat === "undefined") ? g_notenox : _dat );

  var _a = [];

  for (var id in _dat.db) {
    _a.push( _dat.db[id] );
  }

  _a.sort( _timestamp_desc );

  return _a;
}

function notenox_viewer_filter_title(_title, _dat) {
  _dat = ( (typeof _dat === "undefined") ? g_notenox : _dat );

  var _a = [];

  for (var id in _dat.db) {
    for (var ii=0; ii<_dat.db[id].keyword.length; ii++) {
      var kw = _dat.db[id].keyword[ii];
      if ( ! kw.match( /^title:/ ) ) { continue; }
      if (kw == ("title:" + _title)) {
        _a.push( _dat.db[id] );
      }
    }
  }

  _a.sort( _timestamp_desc );

  return _a;

}

function notenox_viewer_filter_keyword(_kw, _dat) {
  _dat = ( (typeof _dat === "undefined") ? g_notenox : _dat );

  var _a = [];

  for (var id in _dat.db) {
    for (var ii=0; ii<_dat.db[id].keyword.length; ii++) {
      if (_kw == _dat.db[id].keyword[ii]) {
        _a.push( _dat.db[id] );
      }
    }
  }

  _a.sort( _timestamp_desc );

  return _a;

}

// --------------
// --------------
// --------------

function notenox_viewer_post_init(data) {
  data = ((typeof data === "undefined") ? g_notenox : data);

  // sort title by last time an entry was updated (desc)
  // and add to left title list
  //
  var title_time = {};
  for (var id in data.db) {

    var kwa = data.db[id].keyword;
    for (var ii=0; ii<kwa.length; ii++) {
      if ( ! kwa[ii].match( /^title:/ ) ) { continue; }
      var _title = kwa[ii].replace(/^title:/, '');
      if ( _title in title_time ) {
        if ( title_time[_title] < data.db[id].timestamp ) {
          title_time[_title] = data.db[id].timestamp;
        }
      }
      else {
        title_time[_title] = data.db[id].timestamp;
      }
    }
  }

  var title_a = [];
  for (var _title in title_time) {
    title_a.push( { "title": _title, "timestamp": title_time[_title] } );
  }

  title_a.sort( function(x,y) { if (x.timestamp < y.timestamp) { return 1; } return -1; } );

  var title_list_ele = document.getElementById("notenox-ui-title-list");
  title_list_ele.innerHTML = '';
  for (var ii=0; ii<title_a.length; ii++) {

    var href = _a( title_a[ii].title, "#title=" + title_a[ii].title );
    href.onclick = (function(__x) {
      return function() {
        notenox_viewer_ui_title(__x);
      };
    })(title_a[ii].title);

    var td = _td();
    td.appendChild( href );
    var tr = _tr();
    tr.appendChild( td );

    title_list_ele.appendChild( tr )

  }

  //----

  // sort keyword by frequency (desc)
  // and add to left keyword list,
  // skipping titles
  //

  var kw_a = [];
  for (var _kw in data.freq.keyword) {
    if ( _kw.match(/^title:/) ) { continue; }
    kw_a.push( { "keyword": _kw, "freq" : data.freq.keyword[_kw] } )
  }

  kw_a.sort( function(x,y) { if (x.freq < y.freq) { return 1; } return -1; } );

  var kw_list_ele = document.getElementById("notenox-ui-keyword-list");
  kw_list_ele.innerHTML = '';
  for (var ii=0; ii<kw_a.length; ii++) {

    var href = _a( kw_a[ii].keyword + " (" + kw_a[ii].freq + ")", "#keyword=" + kw_a[ii].keyword);
    href.onclick = (function(__x) {
      return function() {
        notenox_viewer_ui_keyword(__x);
      };
    })(kw_a[ii].keyword);


    var td = _td();
    td.appendChild( href );
    var tr = _tr();
    tr.appendChild( td );

    kw_list_ele.appendChild( tr )

  }


}

function notenox_viewer_load_db(data) {
  var _g;

  g_notenox = {
    "db":{},
    "graph": { "keyword":{}, "title": {} },
    "freq" : { "keyword":{}, "title":{} }
  };


  g_notenox.db = data;
  _g = g_notenox;

  for (var id in data) {
    var _ent = data[id];

    for (var idx=0; idx<_ent.keyword.length; idx++) {
      var kw = _ent.keyword[idx];

      if ( !(kw in _g.graph.keyword) ) {
        _g.graph.keyword[kw] = {};
        _g.freq.keyword[kw] = 0;
      }

      _g.graph.keyword[kw][id] = id;
      _g.freq.keyword[kw] ++;

    }
  }

}

// https://stackoverflow.com/a/39571547
// cc-by-sa user xgqfrms
//
function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'data/notenox-db.json', true);

  xobj.onreadystatechange = function() {
      if (xobj.readyState === 4 && xobj.status === 200) {
          // Required use of an anonymous callback 
          // as .open() will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
      }
  };

  xobj.send(null);
}

function notenox_viewer_init() {
  console.log("notenox init");
  loadJSON(function(response) {
    var _dat = JSON.parse(response);
    notenox_viewer_load_db(_dat);
    notenox_viewer_post_init();
  });
}


notenox_viewer_init();
