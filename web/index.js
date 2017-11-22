var express = require("express");

module.exports = function() {
  var router = express.Router();

  router.get("/", function(req, res) {
    res.render("login", {layout: "landing"});
  });

  router.get("/signup", function(req, res) {
    res.render("signup", {layout: "landing"});
  });

  router.get("/closets", function(req, res) {
    res.locals.metaTags = {
      title: "Closets"
    };
    res.render("closets", {
      layout: "main",
      closetTypes: [
        {title: "active"},
        {title: "casual"},
        {title: "formal"},
        {title: "work"},
        {title: "other"},
      ]
    })
  });

  router.get("/closet/:closet", function(req, res) {
    res.locals.metaTags = {
      title: req.params.closet
    };
    res.render("closet", {layout: "main"});
  });

  return router;
}
