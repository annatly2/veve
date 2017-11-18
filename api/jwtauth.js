var jwt = require("jwt-simple");
var uu = require("./user_utils")

module.exports = function(app) {
  return function(req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers["x-access-token"];
    if (token) {
      try {
        var decoded = jwt.decode(token, app.get("jwtSecret"));
        if (decoded.exp <= Date.now()) {
          return res.end("Access token has expired", 400);
        }
        uu.get(decoded.iss)
          .then(function(user) {
            req.user = user;
            next();
          })
          .catch(function(err) {
            next();
          })
      } catch(err) {
        return next();
      }
    } else {
      return next();
    }
  }
}
