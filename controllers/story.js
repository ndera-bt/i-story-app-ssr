const Story = require("../model/story");
const { validationResult } = require("express-validator");
const Response = require("../util/response");
const { tryCatch } = require("../util/tryCatch");
const StoryManager = require("../actions/story-action");
const Tag = require("../model/tags");

exports.getIndex = async (req, res, next) => {
  const page = +req.query.page || 1;
  const ITEMS_PER_PAGE = 2;
  const pageOffset = (page - 1) * ITEMS_PER_PAGE || 2;
  const options = {
    limit: ITEMS_PER_PAGE,
    offset: pageOffset,
  };
  const [errors, { count, rows }] = await tryCatch(
    StoryManager.getStories,
    options
  );

  if (errors) {
    return next(errors);
  }
  res.render("story/index", {
    pageTitle: "Home",
    stories: rows,
    currentPage: page,
    nextPage: page + 1,
    previousPage: page - 1,
    hasNextPage: ITEMS_PER_PAGE * page < count,
    hasPreviousPage: page > 1,
    lastPage: Math.ceil(count / ITEMS_PER_PAGE),
  });
};

exports.getAddStory = async (req, res, next) => {
  const tags = await StoryManager.getTags();

  Response.renderAddStory(
    "story/add_story",
    "Add Story",
    false,
    false,
    [],
    "",
    "",
    tags,
    res
  );
};

exports.postAddStory = async (req, res, next) => {
  const { title, story, tag, isPublic } = req.body;
  const image = req.file;
  const errors = validationResult(req);
  const tags = await StoryManager.getTags();
  let imageUrl = "";
  let status = "";

  if (!errors.isEmpty()) {
    return Response.renderAddStory(
      "story/add_story",
      "Add Story",
      false,
      true,
      errors.array(),
      errors.array()[0].msg,
      { title, story, tag, image, isPublic },
      tags,
      res
    );
  }

  if (image) {
    imageUrl = image.path;
  }
  if (isPublic) {
    status = +isPublic;
  }

  const [error, addStory] = await tryCatch(
    StoryManager.createStory,
    title,
    story,
    tag,
    imageUrl,
    status,
    req.user.id
  );
  if (error) {
    return Response.renderAddStory(
      "story/add_story",
      "Add Story",
      false,
      true,
      [],
      "Unable to add Story, please try again",
      { title, story, tag, image },
      tags,
      res
    );
  }
  res.redirect("/");
};

exports.getStoryDetails = async (req, res, next) => {
  const storyId = req.params.storyId;
  const [error, story] = await tryCatch(StoryManager.getStoryDetails, storyId);
  if (error) {
    return next(error);
  }
  Response.renderPage("story/story_details", "Story Details", "", story, res);
};

exports.getUserStories = async (req, res, next) => {
  const [error, stories] = await tryCatch(
    StoryManager.getUserStories,
    req.user.id
  );
  if (error) {
    return next(error);
  }
  Response.renderPage("story/user_stories", "User Stories", "", stories, res);
};

exports.getEditStory = async (req, res, next) => {
  const storyId = req.params.storyId;
  const editing = req.query.edit;
  const tags = await StoryManager.getTags();
  if (!editing) {
    return res.redirect("/");
  }
  const [error, story] = await tryCatch(StoryManager.getStory, storyId);

  if (error) {
    return next(error);
  }

  Response.renderAddStory(
    "story/add_story",
    "Edit Story",
    true,
    false,
    [],
    "",
    story,
    tags,
    res
  );
};

exports.postEditStory = async (req, res, next) => {
  const { title, story, tag, isPublic, storyId } = req.body;
  const image = req.file;
  let imageUrl = "";
  const status = +isPublic;
  const errors = validationResult(req);
  const tags = await StoryManager.getTags();

  if (!errors.isEmpty()) {
    return Response.renderAddStory(
      "story/add_story",
      "Edit Story",
      false,
      true,
      errors.array(),
      errors.array()[0].msg,
      { title, story, tag, isPublic, storyId },
      tags,
      res
    );
  }

  if (image) {
    imageUrl = image.path;
  }

  const [error, editedStory] = await tryCatch(
    StoryManager.editStory,
    title,
    story,
    tag,
    imageUrl,
    status,
    storyId,
    req.user.id
  );
  if (error) {
    return Response.renderAddStory(
      "story/add_story",
      "Edit Story",
      true,
      true,
      [],
      "Unable to update Story, please try again",
      { title, story, tag, isPublic, storyId, tagId, image },
      tags,
      res
    );
  }
  if (editedStory) {
    console.log("story updated");
    res.redirect("/");
  }
};

exports.deleteStory = async (req, res, next) => {
  const { storyId } = req.body;

  const [fetchError, stories] = await tryCatch(
    StoryManager.getUserStories,
    req.user.id
  );
  if (fetchError) {
    return next(fetchError);
  }
  const [deleteError, deletedResult] = await tryCatch(
    StoryManager.deleteStory,
    storyId
  );

  if (deleteError) {
    Response.renderPage(
      "story/user_stories",
      "User Stories",
      "Unable to Delete Story",
      stories,
      res
    );
  }
  res.redirect("/");
};
