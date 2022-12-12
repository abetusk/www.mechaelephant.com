// 
// To the extent possible under law, the person who associated CC0 with
// this project has waived all copyright and related or neighboring rights
//c to this project.
//
 

let tplate = [
'<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'\n' +
'  <!-- Basic Page Needs\n' +
'  –––––––––––––––––––––––––––––––––––––––––––––––––– -->\n' +
'  <meta charset="utf-8">\n' +
'  <title>nymlist</title>\n' +
'\n' +
'  <!-- Mobile Specific Metas\n' +
'  –––––––––––––––––––––––––––––––––––––––––––––––––– -->\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
'\n' +
'  <!-- CSS\n' +
'  –––––––––––––––––––––––––––––––––––––––––––––––––– -->\n' +
'  <link rel="stylesheet" href="css/normalize.css">\n' +
'  <link rel="stylesheet" href="css/skeleton.css">\n' +
'  <link rel="stylesheet" href="css/custom.css">\n' +
'\n' +
'  <!-- Scripts\n' +
'  –––––––––––––––––––––––––––––––––––––––––––––––––– -->\n' +
'  <script src="js/jquery.min.js"></script>\n' +
'\n' +
'  <!-- Favicon\n' +
'  –––––––––––––––––––––––––––––––––––––––––––––––––– -->\n' +
'  <link rel="icon" type="image/png" href="/img/favicon.png">\n' +
'\n' +
'</head>\n' +
'<body>\n' +
'\n' +
'  <div class="section">\n' +
'    <div class="container">\n' +
'\n' +
'      <h3 class="section-heading">nymlist</h3>\n' +
'      <h6 class="section-description">@abetusk</h6>\n' +
'      <h6  class="section-description">libre/free advocate</h6>\n' +
'      <div class="row"> <div class="one column"></div> </div>\n' +
'\n',

'    </div>\n' +
'  </div>\n' +
'\n' +
'</body>\n' +
'</html>\n'
]

let nym_ele_tplate = [
'      <div class="row">\n' +
'        <div class="two columns"> &nbsp;  </div>\n' +
'        <div class="eight columns" style="text-align: center;">\n',

'        </div>\n' +
'        <div class="two columns"> &nbsp; </div>\n' +
'      </div>\n'
]


function nym_button_link(link, descr) {
  return '<a class="button" href="' + link + '"> ' + descr + ' </a>\n';
}

let nym_list = [

  { "descr": "abetusk.github.io", "link": 'https://abetusk.github.io/' },
  { "descr": "github", "link": 'https://github.com/abetusk' },
  { "descr": "mechaelephant.com", "link": 'https://mechaelephant.com' },
  { "descr": "twitter", "link": 'https://twitter.com/abetusk' },
  { "link": 'https://www.fxhash.xyz/u/abetusk', "descr" : 'fxhash' },
  { "descr": "mastadon.social", "link": 'https://mastodon.social/@abetusk' },
  { "descr": "instagram", "link": 'https://www.instagram.com/abetusk/' },
  { "descr": "youtube", "link": 'https://www.youtube.com/@abetusk' },
  { "descr": "facebook", "link": 'https://www.facebook.com/profile.php?id=100006835906966' },
  { "descr": "tumblr", "link": 'https://www.tumblr.com/abetusk' },

  //{ "descr": "", "link": '' },
  //{ "descr": "", "link": '' },
];

console.log(tplate[0]);

for (let i=0; i<nym_list.length; i++) {
  console.log(nym_ele_tplate[0]);
  console.log( "          " + nym_button_link( nym_list[i].link, nym_list[i].descr ) );
  console.log(nym_ele_tplate[1]);
}

console.log(tplate[1]);



