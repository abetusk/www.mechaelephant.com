var g_db = {};

function simple_escape_html(s) {
  s = s.toString();

  s = s.replace(/&/g, '&amp;');
  s = s.replace(/</g, '&lt;');
  s = s.replace(/>/g, '&gt;');
  s = s.replace(/"/g, '&quot;');
  s = s.replace(/'/g, '&#039;');

  return s;
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

function show_error(e) {
  let msg = e.message;

  let ui_error = document.getElementById("ui_error");
  ui_error.innerHTML = "ERROR: " + msg;
  ui_error.style["display"] = "block";
}

function clear_error() {
  let ui_error = document.getElementById("ui_error");
  ui_error.style["display"] = "none";
}

function ui_simple_query(query_txt) {
  let res = {};

  try {
    res = g_db.exec(query_txt);
  }
  catch (e) {
    show_error(e);
    return;
  }

  clear_error();

  let table = document.getElementById("datatableSimple");
  table.innerHTML = "";

  if (typeof res === "undefined") { return; }
  if (res.length < 1) { return; }

  let col = res[0].columns;
  let val = res[0].values;

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

function switch_tab(tab_id) {
  let tab_ids = [ "ui_tab_query", "ui_tab_schema", "ui_tab_download" ];

  for (let ii=0; ii<tab_ids.length; ii++) {
    let ele = document.getElementById(tab_ids[ii]);
    if (tab_id == tab_ids[ii]) {
      ele.style["display"] = "block";
    }
    else {
      ele.style["display"] = "none";
    }
  }

}

function ui_query_form(e) {
  e.preventDefault();

  console.log("...");

}

//----
// CC-BY-SA  https://stackoverflow.com/users/1832062/stefanos-chrs
// https://stackoverflow.com/a/49917066
//
function download(url) {
  const a = document.createElement('a')
  a.href = url
  a.download = url.split('/').pop()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
//
//----

function query_quick_search() {
  let txt = document.getElementById("ui_query_quick_text").value;

  let query_txt = "select p.post_id, p.date, p.link, p.title  from post p \n" +
    " where ( p.title like '%" + txt + "%' or p.link like '%" + txt + "%' or p.content like '%" + txt + "%' ) \n" +
    " order by p.date desc limit 10\n";

  let query_ele = document.getElementById("ui_query_text");
  query_ele.value = query_txt;

  ui_simple_query(query_txt);
}

function db_ready() {
  let ele = document.getElementById("ui_db_ready");
  ele.classList.remove("btn-danger")
  ele.classList.add("btn-light")
  ele.innerHTML = "DB ready";
}

$(document).ready( function() {

  // Use a web worker to load the SQL database so it
  // doesn't drag everything to a halt.
  //
  var wurk = new Worker("js/HaD-db-sql-load.js");
  wurk.addEventListener('message', function(e) {
    var uintarray = e.data;
    g_db = new SQL.Database(uintarray);

    db_ready();

    console.log("ready");
  });

  $("#ui_nav_query").click(function(e) { switch_tab("ui_tab_query"); });
  $("#ui_nav_schema").click(function(e) { switch_tab("ui_tab_schema"); });
  $("#ui_nav_download").click(function(e) { switch_tab("ui_tab_download"); });

  $("#ui_download").click(function(e) { download("HaD.sqlite3.gz"); });

  $("#ui_query_execute").click(function(e) {
    let query_txt = document.getElementById("ui_query_text").value;
    ui_simple_query(query_txt);
  });

  $("#ui_query_quick_execute").click(function(e) {
    query_quick_search();
    return;
  });

  $("#ui_query_quick_text").keypress(function(e) {
    if (e.which == 13) {
      console.log("bang");
      query_quick_search();
      return false;
    }
  });

});


