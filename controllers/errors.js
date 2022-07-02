exports.get404 = (req, res, next) => {
  res.render("404", { pageTitle: "404 Page" });
};

exports.get500 = (req, res, next) => {
  res.render("500", { pageTitle: "500 Page" });
};
