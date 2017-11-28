module.exports = function(sequelize, DataTypes) {
  var Garment = sequelize.define("Garment", {
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    image: {
      type: DataTypes.TEXT
    },
    category: {
      type: DataTypes.STRING
    },
    closet: {
      type: DataTypes.STRING
    },
  });

  Garment.associate = function(models) {
    Garment.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      },
      onDelete: "cascade"
    });
  };

  return Garment;
}
