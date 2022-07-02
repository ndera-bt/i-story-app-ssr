const Story = require("../model/story");
const User = require("../model/user");
const Tag = require("../model/tags");
const StoryTag = require("../model/story_tags");

Story.belongsTo(User, { constraint: true, onDelete: "CASCADE" });
User.hasMany(Story);

Story.belongsToMany(Tag, { through: StoryTag });
Tag.belongsToMany(Story, { through: StoryTag });
