var express = require("express");
var bodyparser = require("body-parser");

var PORT = process.env.PORT || 8000;
var app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use(express.static("public"));

app.listen(PORT, function() {
  console.log(`App listening at http://localhost:${PORT}`);
});
