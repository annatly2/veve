var jwt = require("jwt-simple");
var cu = require("./crypto_utils");
var models = require("../models");
var User = models.User;

function getUser(email) {
  var emailHash = cu.hashSync(email);
  return User.findOne({where: {email: emailHash}})
}

function verifyUser(email, password) {
  return getUser(email)
    .then(function(user) {
      if (user === null) throw new Error("email not registered");
      return cu.hashPassword(password, user.dataValues.salt)
        .then(function(passToCheck) {
          if (passToCheck === user.dataValues.password) return user;
          return null;
        })
    })
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
  verify: verifyUser,

  update: function(email, values) {
    return getUser(email)
      .then(function(user) {
        if (user === null) throw new Error("user not found");
        var hashEmail = cu.hashSync(values.email);
        var salt = cu.newSaltSync(values.email);
        var makePassword = cu.hashPassword(values.password, salt);
        var encryptUsername = cu.encrypt(values.username, salt);
        return Promise.all([hashEmail, salt, makePassword, encryptUsername])
          .then(function(values) {
            return user.update({
              email:    values[0],
              salt:     values[1],
              password: values[2],
              username: values[3]
            })
          })
      })
  },

  delete: function(email, password, username) {
    return verifyUser(email, password)
      .then(function(user) {
        if (user === null) throw new Error("incorrect credentials");
        return cu.encrypt(username, user.dataValues.salt)
          .then(function(encryptUsername) {
            if (encryptUsername !== user.dataValues.username) throw new Error("incorrect credentials");
            return user.destroy()
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
