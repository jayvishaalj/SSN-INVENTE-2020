var express = require("express");
var router = express.Router();
const logger = require("../../config/logger")(module);
/* GET users listing. */
router.get("/", function (req, res, next) {
  const messages = req.flash();
  if (req.session.isLogged) {
    if (req.session.data) {
      logger.log("info", `User Entered Home Page ${req.session.data.name}`);
      return res.render("home", {
        messages,
        username: req.session.data.name,
        isLogged: req.session.isLogged,
      });
    } else {
      return res.redirect("/auth/login");
    }
  } else {
    console.log("IsLogged itself not Found");
    return res.redirect("/auth/login");
  }
});

module.exports = router;
