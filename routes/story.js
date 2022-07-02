const express = require("express");
const storyController = require("../controllers/story");
const isAuth = require("../middleware/isAuth");
const { check, body } = require("express-validator/check");

const router = express.Router();

router.get("/", storyController.getIndex);

router.get("/add_story", isAuth, storyController.getAddStory);

router.post(
  "/add_story",
  isAuth,
  [
    body("title", "Invalid title").trim().isLength({ min: 5 }),
    body("story", "Story body invalid").trim().isLength({ min: 5 }),
    body("tag", "invalid tags").trim().isLength({ min: 2 }),
  ],
  storyController.postAddStory
);

router.post(
  "/edit_story",
  isAuth,
  [
    body("title", "Invalid title").trim().isLength({ min: 5 }),
    body("story", "Story body invalid").trim().isLength({ min: 5 }),
    body("tag", "invalid tags").trim().isLength({ min: 2 }),
  ],
  storyController.postEditStory
);

router.get("/story_details/:storyId", storyController.getStoryDetails);

router.get("/edit_story/:storyId", isAuth, storyController.getEditStory);

router.get("/user_stories", isAuth, storyController.getUserStories);

router.post("/delete_story", isAuth, storyController.deleteStory);

module.exports = router;
