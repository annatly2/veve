var user = require("./user");

var options = {};
if (process.env.NODE_ENV === "development") {
  options = {force: true};
}

user.sync(options)
  // .then() // sync other models; order might matter

module.exports = {
  User: user,
};
