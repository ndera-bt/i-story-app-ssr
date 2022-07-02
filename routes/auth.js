const express = require("express");
const Authcontroller = require("../controllers/auth");
const { body, check } = require("express-validator/check");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/login", Authcontroller.getLogin);

router.get("/signup", Authcontroller.getSignup);

router.get("/dashboard", isAuth, Authcontroller.getDashbaord);

router.post(
  "/signup",
  [
    body("name", "Invalid Name input").trim().isLength({ min: 2 }),
    check("email", "Invalid Email").isEmail().normalizeEmail(),
    body("password", "Invalid Password").isLength({ min: 5 }).trim(),
    body("confpassword", "Password do not match")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password do not match");
        }
        return true;
      }),
  ],
  Authcontroller.postSignup
);

router.post(
  "/login",
  [
    check("email", "Invalid email").isEmail().normalizeEmail(),
    body("password", "Invalid Password").trim().isLength({ min: 5 }),
  ],
  Authcontroller.postLogin
);

router.post("/logout", Authcontroller.postLogout);

module.exports = router;
