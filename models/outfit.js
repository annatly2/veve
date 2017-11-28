module.exports = function(sequelize, DataTypes) {
  var Outfit = sequelize.define("Outfit", {
    name: {
      type: DataTypes.STRING
    },
    closet: {
      type: DataTypes.STRING
    },
    shared: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    headwear: {
      type: DataTypes.INTEGER,
      references: {
        model: "Garments",
        key: "id"
      }
    },
    top: {
      type: DataTypes.INTEGER,
      references: {
        model: "Garments",
        key: "id"
      }
    },
    outerwear: {
      type: DataTypes.INTEGER,
      references: {
        model: "Garments",
        key: "id"
      }
    },
    bottom: {
      type: DataTypes.INTEGER,
      references: {
        model: "Garments",
        key: "id"
      }
    },
    shoes: {
      type: DataTypes.INTEGER,
      references: {
        model: "Garments",
        key: "id"
      }
    },
  });

  Outfit.associate = function(models) {
    Outfit.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      },
      onDelete: "cascade"
    });
  };

  return Outfit;
}
