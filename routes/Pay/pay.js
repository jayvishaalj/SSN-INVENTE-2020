var express = require("express");
var router = express.Router();
const logger = require("../../config/logger")(module);

/* GET ECE Dept Page */
router.get("/", function (req, res, next) {
  const messages = req.flash();
  if (req.session.isLogged) {
    if (req.session.data) {
      logger.log("info", `User Entered Home Page ${req.session.data.name}`);
      return res.render("pay", {
        messages,
        username: req.session.data.name,
        isLogged: req.session.isLogged,
      });
    } else {
      return res.render("/auth/login", { messages });
    }
  } else {
    return res.render("/auth/login", { messages });
  }
});

module.exports = router;
