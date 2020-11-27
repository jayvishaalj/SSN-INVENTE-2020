var express = require("express");
var router = express.Router();
const logger = require("../../config/logger")(module);

/* GET CSE Dept Page */
router.get("/", function (req, res, next) {
  const messages = req.flash();
  if (req.session.isLogged) {
    if (req.session.data) {
      logger.log("info", `User Entered MECH Page ${req.session.data.name}`);
      return res.render("mech", {
        messages,
        username: req.session.data.name,
        isLogged: req.session.isLogged,
      });
    } else {
      return res.render("mech", { messages });
    }
  } else {
    return res.render("mech", { messages });
  }
});

module.exports = router;
