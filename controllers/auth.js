const { validationResult } = require("express-validator/check");
const { createUser } = require("../actions/signup-action");
const { userLogin } = require("../actions/login-action");
const { tryCatch } = require("../util/tryCatch");
const Response = require("../util/response");

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    errorMsg: "",
    validationError: [],
    oldInput: "",
  });
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    errorMsg: "",
    validationError: [],
    data: "",
  });
};

exports.getDashbaord = (req, res, next) => {
  res.render("story/dashboard", { pageTitle: "Dashboard" });
};

exports.postSignup = async (req, res, next) => {
  const { name, email, password, confpassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Response.error(
      "auth/signup",
      "Signup",
      errors.array()[0].msg,
      errors.array(),
      { name, email, password, confpassword },
      res
    );
  }

  const [error, user] = await tryCatch(createUser, name, email, password);
  if (error) {
    return Response.error(
      "auth/signup",
      "Signup",
      "Unable to create account, Please try again",
      errors.array(),
      { name, email, password },
      res
    );
  }
  return res.redirect("/login");
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Response.error(
      "auth/login",
      "Login",
      errors.array()[0].msg,
      errors.array(),
      { email, password },
      res
    );
  }

  const [error, logged] = await tryCatch(userLogin, email, password);
  if (error) {
    return Response.error(
      "auth/login",
      "Login",
      error.message,
      [],
      { email, password },
      res
    );
  }
  req.session.isLoggedIn = true;
  req.session.user = logged;
  return req.session.save((err) => {
    console.log(err);
    res.redirect("/dashboard");
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    return res.redirect("/");
  });
};
