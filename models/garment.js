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
    type: Sequelize.STRING
  },
  closet:{
    type: Sequelize.STRING
  },
});

Garment.associate = function(models){
  Garment.belongsTo(models.User, {
    foreignKey: {
      allowNull: false
    }
  });
};

module.exports = Garment;