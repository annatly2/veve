module.exports = function(sequelize, DataTypes) {
  var Garment = sequelize.define("Garment", {
    name: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.TEXT
    },
    closet: {
      type: DataTypes.STRING
    },
  });

  Garment.associate = function(models) {
    Garment.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Garment;
}
