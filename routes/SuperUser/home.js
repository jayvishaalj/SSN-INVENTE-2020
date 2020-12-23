var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);
const { authSuperUser } = require("../middleware/superUserAuth");

router.get("/", authSuperUser, (req, res) => {
  const messages = req.flash();
  console.log("SUPER HOME ");
  return res.render("superHome", {
    messages,
    username: req.session.superUserData.name,
    searchedUserName: req.session.searchedUserName,
    amountPaid: req.session.amountPaid,
  });
});

module.exports = router;
