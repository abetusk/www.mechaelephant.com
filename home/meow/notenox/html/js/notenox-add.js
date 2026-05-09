
/*
*
* To the extent possible under law, the person who associated CC0 with
* this source code has waived all copyright and related or neighboring rights
* to this source code.
*
* You should have received a copy of the CC0 legalcode along with this
* work.  If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
*
*/

var DB = {};

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' +
         s4() + '-' +
         s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}


function _clear() {
  let ui_title = document.getElementById('ui_title');
  let ui_tags = document.getElementById('ui_tags');
  let ui_text = document.getElementById('ui_text');
  let ui_links = document.getElementById('ui_links');

  ui_title.value = '';
  ui_tags.value = '';
  ui_text.value = '';
  ui_links.value = '';
}

function _collect_data() {
  let ui_title = document.getElementById('ui_title');
  let ui_tags = document.getElementById('ui_tags');
  let ui_text = document.getElementById('ui_text');
  let ui_links = document.getElementById('ui_links');

  let txt_title = ui_title.value;
  let txt_tags = ui_tags.value;
  let txt_txt = ui_text.value;
  let txt_links = ui_links.value;


  let a_tags = [];
  let _tags = txt_tags.split(";");
  for (let i=0; i<_tags.length; i++) {
    a_tags.push( _tags[i].trim() );
  }

  let a_links = [];
  let _links = txt_links.split("\n");
  for (let i=0; i<_links.length; i++) {
    a_links.push( _links[i].trim() );
  }

  let data = {
    "id" : guid(),
    "timestamp" : Date.now() / 1000.0,
    "keyword": a_tags,
    "extra" : [],
    "note": txt_txt,
    "link": a_links
  };

  return data
}

function _preview() {
  let data = _collect_data();
  let ui_preview = document.getElementById("ui_preview");
  let txt_data = JSON.stringify(data, undefined, 2);
  ui_preview.value = txt_data;
  ui_preview.style.height = ui_preview.scrollHeight + 'px';
}

function _submit_success(txt) {

  let msg_data = JSON.parse(txt);
  let data = {};
  if ("data" in msg_data) {
    data = JSON.parse(msg_data.data);
  }

  let uuid = '';
  if ("id" in data) { uuid = data.id; }

  _clear();

  let ui_preview = document.getElementById("ui_preview");
  ui_preview.value = "success: " + uuid;
}

function _submit() {
  let data = _collect_data();
  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'notenox_add.html');
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  let body_txt = JSON.stringify( data );

  xhr.onload = function() {
    if ((xhr.readyState == 4) && (xhr.status == 201)) {
      console.log("got:", xhr.responseText);
      _submit_success( xhr.responseText );
    }
    else {
      console.log("error:", xhr.status);
    }
  };

  xhr.send(body_txt);
}

function loadDB(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'data/notenox-db.json', true);

  xobj.onreadystatechange = function() {
    if ((xobj.readyState === 4) && (xobj.status === 200)) {
      // Required use of an anonymous callback 
      // as .open() will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function _parsedb(dbtxt) {
  DB = JSON.parse( dbtxt );
}

function notenox_add_button(op) {

  if (op == 'cancel') {
    return;
  }

  if (op == 'preview') {
    _preview();
    return;
  }


  if (op == 'submit') { 
    _submit();
    return;
  }

}

function notenox_add_init() {
  loadDB(_parsedb);
}

notenox_add_init();
