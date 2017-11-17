var express = require("express");

var router = express.Router();

router.post("/signup", function(req, res) {
  /*  TODO:
      Check if email already exists in database
      Return error if email has already been registered
      Or return OK after user has been generated and redirect to profile page
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
      Check if email exists in database
      Return error if email does not exist
      Or check if password is correct
      Return error if password is incorrect
      Or return OK and redirect to profile page
  */
  res.sendStatus(200);
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
