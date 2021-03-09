var nd = require("./name-dread.js");


var r = nd.dread_name();
console.log(JSON.stringify(r, null, 2));


var idx0 = Math.floor( Math.random()*nd.data.epiteth.length );
var idx1 = Math.floor( Math.random()*nd.data.objects.length );

console.log( nd.data.epiteth[idx0], nd.data.objects[idx1] );

console.log(">>>");
