var express = require("express");

var closetTypes = ["active", "casual", "formal", "work", "other"];
var clothingCategories = ["headwear", "tops", "dresses", "outerwear", "bottoms", "shoes", "other"];

module.exports = function() {
  var router = express.Router();

  router.get("/", function(req, res) {
    res.render("login", {layout: "landing"});
  });

  router.get("/signup", function(req, res) {
    res.render("signup", {layout: "landing"});
  });

  router.get("/test", function(req, res) {
    res.render("test", {layout: "main"});
  });

  router.get("/profile", function(req, res) {
    res.render("profile", {layout: "main"});
  });

  router.get("/outfits", function(req, res) {
    res.render("outfits", {layout: "main"});
  });


  router.get("/closets", function(req, res) {
    res.locals.metaTags = {
      title: "Closets"
    };
    res.render("closets", {
      layout: "main",
      closetTypes: closetTypes
    })
  });

  router.get("/closet/:closet", function(req, res) {
    res.locals.metaTags = {
      title: req.params.closet.toLowerCase()
    };
    res.render("closet", {
      layout: "main",
      closetTypes: closetTypes,
      clothingCategories: clothingCategories
    });
  });

  router.get("/privacy", function(req, res) {
    res.render("privacy", {layout: "landing"});
  });

  return router;
};
