const Story = require("../model/story");
const Tag = require("../model/tags");
const fileHelper = require("../util/file");

class StoryManager {
  static async createStory(title, story, tag, imageUrl, status, userId) {
    const addStory = await Story.create({
      title,
      body: story,
      image: imageUrl,
      isPublic: status,
      userId,
    });
    const addTag = await Tag.findOne({ where: { tag: tag } });

    if (!addStory || !addTag) {
      return new Error("Story not added");
    }
    await addStory.addTags(addTag);
    return true;
  }

  static async getStory(storyId) {
    const story = await Story.findOne({
      where: { id: storyId },
      include: [Tag],
    });

    return story;
  }

  static async getStories(options) {
    const { count, rows } = await Story.findAndCountAll({
      where: { isPublic: 1 },
      order: [["createdAt", "DESC"]],
      options,
      include: Tag,
    });
    return { count, rows };
  }

  static async getStoryDetails(storyId) {
    const story = await Story.findOne({
      where: { id: storyId },
      include: [Tag],
    });
    return story;
  }

  static async getUserStories(userId) {
    const stories = await Story.findAll({
      order: [["createdAt", "DESC"]],
      where: { userId: userId },
      include: [Tag],
    });
    if (!stories) {
      return new Error("Stories not found");
    }
    return stories;
  }

  static async getTags() {
    const tags = await Tag.findAll();
    return tags;
  }

  static async editStory(title, story, tag, imageUrl, status, storyId, userId) {
    const getStory = await Story.findByPk(storyId);
    if (!getStory) {
      return new Error("Story not found");
    }
    getStory.title = title;
    getStory.body = story;
    getStory.userId = userId;
    getStory.isPublic = status;
    if (imageUrl) {
      getStory.image = imageUrl;
    }
    const updateStory = await getStory.save();
    const getTag = await Tag.findOne({ where: { tag: tag } });
    if (!updateStory || !getTag) {
      return new Error("Unable to update story");
    }
    await updateStory.setTags(getTag);
    return true;
  }

  static async deleteStory(storyId) {
    const story = await Story.findByPk(storyId);

    if (!story) {
      return new Error("Story no longer exist");
    }
    const deleteStory = await story.destroy();
    fileHelper.deleteFile(story.image);
    if (!deleteStory) {
      return new Error("Unable to delete Story");
    }
    return true;
  }
}

module.exports = StoryManager;
