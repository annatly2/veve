var express = require("express");
var exphbs = require("express-handlebars");
var bodyparser = require("body-parser");
var hbs = require("handlebars");
var db = require("./models");

var PORT = process.env.PORT || 8000;
var app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

var cu = require("./api/crypto_utils");
var randomSecret = cu.hashSync(Date.now().toString());
app.set("jwtSecret", process.env.JWT_SECRET || randomSecret);

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

hbs.registerHelper("capitalize", function(context, options) {
  if (typeof context === "string") {
    return context[0].toUpperCase() + context.slice(1);
  } else {
    return context;
  }
});

app.use(express.static("public"));
app.use("/api", require("./api")(app));
app.use("/", require("./web")(app));

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
