var connection = require("./connection");
var Sequelize = connection.Sequelize;
var sequelize = connection.sequelize;

var Garment = sequelize.define("garment", {
  name:{
    type: Sequelize.STRING
  },
  category:{
    type: Sequelize.STRING
  },
  color:{
    type: Sequelize.STRING
  },
  image:{
    type: Sequelize.TEXT
  },
  closet:{
    type: Sequelize.STRING
  },
});

module.exports = Garment;
