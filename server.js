var express = require("express");
var app = express();

app.use(express.static(__dirname));

app.listen(1211);
console.log("Running on http://localhost:1211");