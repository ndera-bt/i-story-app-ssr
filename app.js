require("dotenv").config({ path: ".env" });
const express = require("express");
const sequelize = require("./config/db_config");
require("./util/associations");
const authRoutes = require("./routes/auth");
const storyRoutes = require("./routes/story");
const path = require("path");
const rootDr = require("./util/path");
const bodyParser = require("body-parser");
const session = require("express-session");
const SessionStore = require("express-session-sequelize")(session.Store);
const User = require("./model/user");
const Tag = require("./model/tags");
const multer = require("multer");
const errorRoutes = require("./routes/errors");
const errorController = require("./controllers/errors");

const app = express();

const sqlSessionStore = new SessionStore({
  db: sequelize,
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(bodyParser.json());

app.use(express.static(path.join(rootDr, "public")));
app.use("/images", express.static(path.join(rootDr, "images")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sqlSessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  (res.locals.isAuthenticated = req.session.isLoggedIn), next();
});

app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  const user = await User.findByPk(req.session.user.id);
  if (!user) {
    return next();
  }
  req.user = user;
  next();
});

app.get("/500", errorController.get500);

app.use(authRoutes);
app.use(storyRoutes);
app.use(errorRoutes);

app.use((error, req, res, next) => {
  res.render("500", {
    pageTitle: "500 Page",
    isAuthenticated: req.session.isLoggedIn,
  });
});

sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
    throw new Error(err);
  });
