var g_db = {};

function simple_escape_html(s) {
  s = s.toString();
    
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return s.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function simple_link(s) {
  return "<a href='" + s.toString() + "'>" + simple_escape_html(s) + "</a>";
}

function simple_display(s) {

  s = s.toString();

  if (s.substr(0,4) == "http") {
    return simple_link(s);
  }
  return simple_escape_html(s);
}

function ui_simple_query(query_txt) {
  let res = g_db.exec(query_txt);

  if (typeof res === "undefined") { return; }
  if (res.length < 1) { return; }

  console.log("cp");

  let col = res[0].columns;
  let val = res[0].values;

  let table = document.getElementById("datatableSimple");
  table.innerHTML = "";

  let thead = document.createElement("thead");
  let thead_row = thead.insertRow();
  for (let ii=(col.length-1); ii>=0; ii--) {
    thead_row.insertCell(0).outerHTML = "<th>" + col[ii] + "</th>";
  }

  let tbody = document.createElement("tbody");
  for (let ii=0; ii<val.length; ii++) {
    let _r = tbody.insertRow();
    for (let jj=(val[ii].length-1); jj>=0; jj--) {
      //let disp_val = encodeURIComponent(val[ii][jj]);
      //let disp_val = simple_escape_html(val[ii][jj]);
      let disp_val = simple_display(val[ii][jj]);
      _r.insertCell(0).innerHTML = disp_val;
    }
  }

  table.appendChild(thead);
  table.appendChild(tbody);

}

$(document).ready( function() {

  // Use a web worker to load the SQL database so it
  // doesn't drag everything to a halt.
  //
  var wurk = new Worker("js/had-db-sql-load.js");
  wurk.addEventListener('message', function(e) {
    var uintarray = e.data;
    g_db = new SQL.Database(uintarray);

    console.log("ready");
  });

});


