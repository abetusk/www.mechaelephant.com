//
// License: cc0
//

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

async function update_cred() {
  var u = document.getElementById("username").value;
  var p = document.getElementById("password").value;


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


function uploadComplete(x) {
	var json_data = JSON.parse( this.response );
	console.log( json_data.id , json_data);
	//window.location.href = "ngc_view?id=" + json_data.id;

  g_data.message.push("complete");


}
function uploadError() { console.log("upload error"); }
function uploadAbort() { console.log("upload abort"); }
function uploadProgress() { console.log("upload progress"); }

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

