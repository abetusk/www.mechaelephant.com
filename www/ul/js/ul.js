
var g_data = {
  "message":[]
};

function init() {
  var a = document.cookie.split(";");
  for (var ii=0; ii<a.length; ii++) {
    var kv = a[ii].split("=");
    if (kv[0].trim() == 'username') {
      document.getElementById("username_button").innerHTML = 'user:' + kv[1].trim();
    }
  }
}

function delete_cookie(key, path) {
  var a = document.cookie.split(";");
  for (var ii=0; ii<a.length; ii++) {
    var kv = a[ii].split("=");
    if (kv[0].trim() == key) {
      if (typeof path !== 'undefined') {
        document.cookie = key + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=" + path;
      }
      else {
        document.cookie = key + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  }
}

async function update_cred() {
  var u = document.getElementById("username").value;
  var p = document.getElementById("password").value;

  delete_cookie("username");
  delete_cookie("passhash");

  var h = await digestMessage(u + ";" + p);

  document.cookie = "username=" + u;
  document.cookie = "passhash=" + h;

  document.getElementById("username_button").innerHTML = 'user:' + u;

  document.getElementById("username").value = '';
  document.getElementById("password").value = '';

}


async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}


function _add_info_row(type_str, msg_str, info_str) {

  var ele = document.getElementById("info_body_element");
  var row = ele.insertRow(0);

  var cell = row.insertCell(-1);
  var t = document.createTextNode(type_str);
  cell.appendChild(t);

  cell = row.insertCell(-1);
  t = document.createTextNode(msg_str);
  cell.appendChild(t);

  cell = row.insertCell(-1);
  t = document.createTextNode(info_str);
  cell.appendChild(t);


}

function uploadComplete(x) {
	var json_data = JSON.parse( this.response );
	console.log( json_data.id , json_data);
	//window.location.href = "ngc_view?id=" + json_data.id;

  g_data.message.push("complete");

  var msg = "...";
  var info = "...";
  if ("id" in json_data) {
    msg = "success";
    info = json_data.id;
  }
  else if ("info" in json_data) {
    msg = "fail";
    info = json_data.info;
  }

  _add_info_row('upload', msg, info);

}

function uploadError() {
  console.log("upload error");

  _add_info_row("upload_error", "fail", "?");
}

function uploadAbort() {
  console.log("upload abort");
  _add_info_row("upload_abort", "fail", "?");
}

function uploadProgress() {
  console.log("upload progress");
  //_add_info_row("upload_progress", "...", "...");
}

function sendFile( file ) {
  console.log("file:");
  console.log(file);

  for (x in file) {
    console.log(x, file[x]);
  }

  var info = document.getElementById("fileInfo").value;

  var formData = new FormData();
  formData.append( "fileData", file );
  formData.append( "fileInfo", info);
  formData.append( "fileName", file["name"])
  formData.append( "fileTime", file["lastModified"]);

  var uri = "ul.py";
  var xhr = new XMLHttpRequest();
  xhr.upload.addEventListener("progress", uploadProgress, false );
  xhr.addEventListener("load", uploadComplete, false );
  xhr.addEventListener("error", uploadError, false );
  xhr.addEventListener("abort", uploadAbort, false );

  xhr.open( "POST", uri );
  xhr.send( formData );

}

function handleFiles( files ) {
  var n = files.length;
  for (var i=0; i<n; i++) {
    sendFile(files[i]);
  }
}

