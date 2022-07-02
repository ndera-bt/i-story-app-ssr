const Sequelize = require("sequelize");
const sequelize = require("../config/db_config");
const PasswordManager = require("../util/password");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

User.beforeCreate(async (user, options) => {
  const hashed = await PasswordManager.hash(user.password);
  user.password = hashed;
});

module.exports = User;
