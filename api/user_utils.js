var jwt = require("jwt-simple");
var cu = require("./crypto_utils");
var models = require("../models");
var User = models.User;

function getUser(email) {
  var emailHash = cu.hashSync(email);
  return User.findOne({where: {email: emailHash}})
}

module.exports = {
  create: function(email, password, username) {
    var hashEmail = cu.hashSync(email);
    var salt = cu.newSaltSync(email);
    var makePassword = cu.hashPassword(password, salt);
    var encryptUsername = cu.encrypt(username, salt);
    return Promise.all([hashEmail, salt, makePassword, encryptUsername])
      .then(function(values) {
        return User.create({
          email:    values[0],
          salt:     values[1],
          password: values[2],
          username: values[3]
        })
      })
  },

  get: getUser,

  verify: function(email, password) {
    return getUser(email)
      .then(function(user) {
        if (user === null) throw new Error("email not registered");
        return cu.hashPassword(password, user.dataValues.salt)
          .then(function(passToCheck) {
            if (passToCheck === user.dataValues.password) return user.dataValues;
            return null;
          })
      })
  },

  // express middleware for JSON Web Tokens
  // https://www.sitepoint.com/using-json-web-tokens-node-js/
  jwtauth: function(app) {
    return function(req, res, next) {
      var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers["x-access-token"];
      if (token) {
        try {
          var decoded = jwt.decode(token, app.get("jwtSecret"));
          if (decoded.exp <= Date.now()) {
            return res.end("Access token has expired", 400);
          }
          getUser(decoded.iss)
            .then(function(user) {
              req.user = user;
              next();
            })
            .catch(function(err) {
              console.error(err);
              next();
            })
        } catch(err) {
          console.error(err);
          return next();
        }
      } else {
        return next();
      }
    }
  },
}
