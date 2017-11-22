var express = require("express");
var exphbs = require("express-handlebars");
var bodyparser = require("body-parser");
var db = require("./models");

var PORT = process.env.PORT || 8000;
var app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.set("jwtSecret", process.env.JWT_SECRET || "JWT_TESTING");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use("/api", require("./api")(app));
app.get("/", function(req, res) {
  res.render("login", {layout: "landing"});
})

app.get("/signup", function(req, res) {
  res.render("signup", {layout: "landing"});
})

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
