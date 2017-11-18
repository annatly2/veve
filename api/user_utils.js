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

  verify(email, password) {
    return getUser(email)
      .then(function(user) {
        if (user === null) throw new Error("email not registered");
        return cu.hashPassword(password, user.dataValues.salt)
          .then(function(passToCheck) {
            if (passToCheck === user.dataValues.password) return user.dataValues;
            return null;
          })
      })
  }
}
