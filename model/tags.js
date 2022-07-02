const Sequelize = require("sequelize");
const sequelize = require("../config/db_config");

const Tag = sequelize.define("tag", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  tag: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Tag;
