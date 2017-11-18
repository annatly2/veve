var express = require("express");
var auth = require("basic-auth");
var jwt = require("jwt-simple");
var moment = require("moment");

var models = require("../models");
var uu = require("./user_utils")
var Garment = models.Garment;

module.exports = function(app) {
  var router = express.Router();
  var jwtauth = uu.jwtauth(app);

  function createToken(email) {
    var expires = moment().add(1, "days").valueOf();
    var token = jwt.encode({
      iss: email,
      exp: expires
    }, app.get("jwtSecret"));
    return {
      token: token,
      expires: expires
    }
  }

  router.post("/signup", function(req, res) {
    uu.get(req.body.email)
      .then(function(user) {
        if (user !== null) {
          throw new Error("email already registered")
        }
        return uu.create(req.body.email, req.body.password, req.body.username);
      })
      .then(function(newUser) {
        var token = createToken(req.body.email);
        res.json({
          error: false,
          session: token
        })
      })
      .catch(function(err) {
        return res.json({
          error: true,
          errorMsg: err.message
        });
      })
  });

  router.get("/token", function(req, res) {
    var header = auth(req);
    uu.verify(header.name, header.pass)
      .then(function(user) {
        if (user === null) {
          res.statusCode = 401;
          res.setHeader("WWW-Authenticate", 'Basic realm="veve"');
          res.end("Access denied");
        } else {
          var token = createToken(header.name);
          res.json(token);
        }
      })
      .catch(function(err) {
        return res.json({
          error: true,
          errorMsg: err.message
        })
      })
  })

  router.get("/test",
    jwtauth,
    function(req, res) {
      if (req.user) {
        res.send(req.user)
      } else {
        res.send("nope")
      }
    }
  )

  router.get("/clothes", function(req,res){
    var query = {};
    if(req.query.email){
      query.Email = req.query.email;
    }
    models.Garment.findAll({
      where: query,
      include: [models.User]
    }).then(function(dbGarment){
      res.json(dbGarment);
    });
  });

  router.post("/clothes", function(req,res){
    models.Garment.create(req.body).then(function(dbGarment){
      res.json(dbGarment);
    });
  });

  router.put("/clothes", function(req,res){
    models.Garment.update(
      req.body,
      {
        where: {
          name: req.body.name
        }
      }).then(function(dbGarment){
        res.json(dbGarment);
      });
  });

  return router;
}
