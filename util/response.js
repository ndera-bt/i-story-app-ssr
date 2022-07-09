const res = require("express/lib/response");

class Response {
  static renderPage(page, pageTitle, errorMsg, data, res) {
    return res.render(page, { pageTitle, errorMsg, data });
  }
  static error(page, pageTitle, errorMsg, validationError, data, res) {
    return res.render(page, { pageTitle, errorMsg, validationError, data });
  }
  static renderAddStory(
    page,
    pageTitle,
    editing,
    hasError,
    validationError,
    errorMsg,
    story,
    tags,
    res
  ) {
    return res.render(page, {
      pageTitle,
      editing,
      hasError,
      validationError,
      errorMsg,
      story,
      tags,
    });
  }
}

module.exports = Response;
