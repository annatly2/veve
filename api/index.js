var express = require("express");

var router = express.Router();

router.post("/signup", function(req, res) {
  /*  TODO:
      Deal with session tokens
  */
  getUser(req.body.email)
    .then(function(user) {
      if (user !== null) {
        throw new Error("email already registered")
      }
      return createUser(req.body.email, req.body.password, req.body.username);
    })
    .then(function(newUser) {
      res.json({
        error: false,
        session: "TODO"
      })
    })
    .catch(function(err) {
      return res.json({
        error: true,
        errorMsg: err
      })
    })
});

router.post("/login", function(req, res) {
  /*  TODO:
      Deal with session tokens
  */
  verifyUser(req.body.email, req.body.password)
    .then(function(verified) {
      if (verified) {
        res.json({
          error: false,
          session: "TODO"
        })
      } else {
        res.json({
          error: true,
          errorMsg: "password not correct"
        })
      }
    })
    .catch(function(err) {
      return res.json({
        error: true,
        errorMsg: err
      })
    })
});

module.exports = router;

// Crypto

var crypto = require("crypto");

function hash(name) {
  return crypto.createHash("sha256").update(name).digest("hex");
}

function newSalt(name) {
  var time = new Date().getTime();
  var data = name + time.toString();
  return hash(data);
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 50000, 256, "sha512").toString("hex");
}

// Models

var models = require("../models");
var User = models.User;

function getUser(email) {
  var emailHash = hash(email);
  return User.findOne({
    where: {
      email: emailHash
    }
  })
  .then(function(results) {
    if (results.length < 1) {
      return null;
    }
    return results[0];
  })
}

function verifyUser(email, password) {
  return getUser(email)
  .then(function(user) {
    if (user === null) {
      throw new Error("email not registered");
    }
    var toCheck = hashPassword(password, user.salt);
    return toCheck === user.password;
  })
}
