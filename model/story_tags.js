const Sequelize = require("sequelize");
const sequelize = require("../config/db_config");

const StoryTag = sequelize.define("story_tag", {});

module.exports = StoryTag;
