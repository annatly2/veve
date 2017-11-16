var connection = require("./connection");
var Sequelize = connection.Sequelize;
var sequelize = connection.sequelize;

var User = sequalize.define("user", {
  email: {
    type: Sequelize.STRING(64),
    validate: {is: /^[a-f0-9]{64}$/i},
  },
  salt: {
    type: Sequelize.STRING(64),
    validate: {is: /^[a-f0-9]{64}$/i},
  },
  password: {
    type: Sequelize.STRING(512),
    validate: {is: /^[a-f0-9]{512}$/i},
  },
});

module.exports = User;
