var moment = require("moment");
var jwt = require("jwt-simple");
var uu = require("./user_utils");

var _tokenVault = {};

var SPOOFED_TOKEN = "Spoofed token";
var EXPIRED_TOKEN = "Token has expired";

module.exports = function(app) {
  function verifyToken(token) {
    try {
      var decoded = jwt.decode(token, app.get("jwtSecret"));
    } catch (err) {
      return console.error(err);
    }

    if (_tokenVault[token] === undefined) throw new Error(SPOOFED_TOKEN);
    if (decoded.exp <= Date.now()) {
      delete _tokenVault[decoded];
      throw new Error(EXPIRED_TOKEN);
    }

    return decoded;
  }

  return {
    create: function(email) {
      var expires = moment().add(1, "days").valueOf();
      var token = jwt.encode({
        iss: email,
        exp: expires
      }, app.get("jwtSecret"));
      console.log(token);

      _tokenVault[token] = true;

      return {
        token: token,
        expires: expires
      }
    },

    verify: verifyToken,

    // express middleware for JSON Web Tokens
    // https://www.sitepoint.com/using-json-web-tokens-node-js/
    middleware: function(app) {
      return function(req, res, next) {
        // possible alternative token locations:
        // (req.body && req.body.access_token) || (req.query && req.query.access_token)
        var token = req.headers["x-access-token"];
        if (token) {
          try {
            verifyToken(token);
          } catch (err) {
            console.log(err);
            next();
          }
          // try {
          //   var decoded = jwt.decode(token, app.get("jwtSecret"));
          //   if (decoded.exp <= Date.now()) {
          //     return res.end("Access token has expired", 400);
          //   }
          //   getUser(decoded.iss)
          //     .then(function(user) {
          //       req.user = user;
          //       next();
          //     })
          //     .catch(function(err) {
          //       console.error(err);
          //       next();
          //     })
          // } catch(err) {
          //   console.error(err);
          //   return next();
          // }
        } else {
          return next();
        }
      }
    },
  }
}
