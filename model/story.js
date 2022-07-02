const Sequelize = require("sequelize");
const sequelize = require("../config/db_config");

const Story = sequelize.define("story", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isPublic: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
});

// sequelize.addHook("beforeCount", (options) => {
//   options.group = ["id"];
// });

module.exports = Story;
