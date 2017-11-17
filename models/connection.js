var Sequelize = require("sequelize");
var db_url = process.env.DATABASE_URL || "postgres://postgres@localhost:5432/veve";

module.exports = {
  Sequelize: Sequelize,
  sequelize: new Sequelize(db_url),
};
