var express = require("express");

var closetTypes = ["active", "casual", "formal", "work", "other"];
var clothingCategories = ["headwear", "tops", "dresses", "outerwear", "bottoms", "shoes", "other"];

module.exports = function() {
  var router = express.Router();

  // Public Pages

  router.get("/", function(req, res) {
    res.render("login", {layout: "landing"});
  });

  router.get("/signup", function(req, res) {
    res.render("signup", {layout: "landing"});
  });

  router.get("/privacy", function(req, res) {
    res.render("privacy", {layout: "landing"});
  });

  router.get("/about", function(req, res) {
    res.render("about", {layout: "landing"});
  });

  // Private Pages

  router.get("/profile", function(req, res) {
    res.locals.metaTags = {
      title: "Your Profile"
    };
    res.render("profile", {layout: "main"});
  });

  router.get("/shop", function(req, res) {
    res.locals.metaTags = {
      title: "Shop"
    };
    res.render("shop", {layout: "main"});
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

  return router;
};
