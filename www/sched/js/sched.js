
function _parseJSONCalendar(resp) {
  console.log(">>>", resp);

  let data = {};

  try {

    data = JSON.parse(resp);

  }
  catch {
    console.log("error ...");
    return;
  }

  let sched = data.sched;
  console.log(sched);
  for (let idx=0; idx<sched.length; idx++) {
    let dt = new Date(Date.parse(sched[idx].Date));
    sched[idx].Date = dt;
  }

  let settings = {};
  let element = document.getElementById('caleandar');
  caleandar(element, sched, settings);

}

function _xhrFail(status, resp) {
  console.log("fail:", status, resp);
}

function _onload() {
  console.log(this.status, this.response, this);
}

function fetchJSON(url, cb, cb_fail) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = 'text';
  xhr.onload = function() {
    //console.log(xhr);
    //console.log(xhr.responseText, xhr.responseXML);
    let status = xhr.status;
    if (status == 200) {
      cb(xhr.response);
    }
    else {
      cb_fail(status, xhr.response);
    }
  }
  xhr.send();
}

function init() {
  fetchJSON("data/sched.json", _parseJSONCalendar, _xhrFail);
}

/*
var events = [
  {'Date': new Date(2023, 4, 7), 'Title': 'Doctor appointment at 3:25pm.'},
  {'Date': new Date(2023, 4, 18), 'Title': 'New Garfield movie comes out!', 'Link': 'https://garfield.com'},
  {'Date': new Date(2023, 4, 27), 'Title': '25 year anniversary', 'Link': 'https://www.google.com.au/#q=anniversary+gifts'},
];
var settings = {};
var element = document.getElementById('caleandar');
caleandar(element, events, settings);
*/

