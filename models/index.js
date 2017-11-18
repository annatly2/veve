var user = require("./user");
var garment = require("./garment");

var options = {};
if (process.env.NODE_ENV === "development") {
  console.log("OVERWRITING ENTIRE DATABASE");
  options = {force: true};
}

user.hasMany(garment, {
  onDelete: "cascade"
});

garment.belongsTo(user, {
  foreignKey: {
    allowNull: false
  }
})

user.sync(options)
  .then(garment.sync(options))

module.exports = {
  Garment: garment,
  User: user,
};
