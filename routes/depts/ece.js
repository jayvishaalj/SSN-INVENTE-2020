var express = require("express");
var router = express.Router();
const logger = require("../../config/logger")(module);

/* GET ECE Dept Page */
router.get("/", function (req, res, next) {
  const messages = req.flash();
  return res.render("ece", { messages, isLogged: req.session.isLogged });
});

module.exports = router;
