var express = require("express");
var bodyparser = require("body-parser");
var jwt = require("jwt-simple");
var db = require("./models")

var PORT = process.env.PORT || 8000;
var app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.set("jwtSecret", process.env.JWT_SECRET || "JWT_TESTING");

app.use(express.static("public"));
app.use("/api", require("./api")(app));

var db_options = {};
if (process.env.NODE_DB_ENV === "overwrite") {
  console.log("OVERWRITING DATABASE ON RELOAD");
  db_options.force = true;
}

db.sequelize.sync(db_options)
  .then(function() {
    app.listen(PORT, function() {
      console.log(`App listening at http://localhost:${PORT}`);
    });
  })
