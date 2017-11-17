var user = require("./user");
var garment = require("./garment");

var options = {};
if (process.env.NODE_ENV === "development") {
  options = {force: true};
}

user.sync(options)
  .then(garment.sync(options)) // sync other models; order might matter

module.exports = {
  Garment: garment,
  User: user,
};
