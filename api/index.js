var express = require("express");
var auth = require("basic-auth");
var jwt = require("jwt-simple");
var moment = require("moment");

var models = require("../models");
var uu = require("./user_utils");
var User = models.User;
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
  });

  router.get("/clothes/:closet",
    jwtauth,
    function(req, res) {
      if (req.user === undefined) {
        res.sendStatus(401);
        return res.end();
      }

      var query = {where: {userId: req.user.dataValues.id}};
      if (req.params.closet !== "all") {
        query.where.closet = req.params.closet;
      }

      Garment.findAll(query)
        .then(function(garments) {
          res.json({
            error: false,
            garments: garments
          });
        })
        .catch(function(err) {
          res.json({
            error: true,
            errorMsg: err.message
          });
        })
    }
  );

  router.post("/clothes",
    jwtauth,
    function(req, res) {
      var garment = req.body;
      garment.userId = req.user.id;

      Garment.create(garment)
      .then(function(dbGarment){
        res.json(dbGarment);
      });
    }
  );

  router.put("/clothes",
    jwtauth,
    function(req, res) {
      var garment = req.body;

      Garment.update(garment, {where: {id: garment.id}})
        .then(function(updateCount) {
          updateCount = updateCount[0];
          if (updateCount === 1) {
            res.json({
              error: false
            });
          } else {
            res.json({
              error: true,
              errorMsg: `expected to update 1 row, updated ${updateCount}`
            });
          }
        });
    }
  );

  return router;
}
