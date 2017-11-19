var Sequelize = require("sequelize");
var db_url = process.env.DATABASE_URL || "postgres://veve:veve@localhost:5432/veve";

module.exports = {
  Sequelize: Sequelize,
  sequelize: new Sequelize(db_url),
};
