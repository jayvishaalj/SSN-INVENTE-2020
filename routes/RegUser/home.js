var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);
const { authRegUser } = require("../middleware/superUserAuth");

router.get("/", authRegUser, (req, res) => {
  const messages = req.flash();
  console.log("REG USER  HOME ");
  let sql =
    "SELECT users.name, users.email, users.dept as userdept, users.college, users.phone, events.name as eventname, events.dept FROM `users` INNER JOIN `attendees` ON attendees.userid = users.id INNER JOIN `events` ON attendees.eventid = events.id";
  connection.query(sql, [], (err, data) => {
    if (err) {
      req.flash("error", "Something Happened Please Try Again after sometime!");
      logger.log("error", `REG User GET DETAILS EVENTS DB REPORT Error ${err}`);
      return res.redirect("/");
    }
    console.log(data);
    logger.log("info", "REG USER HOME PAGE LOADED");
    return res.render("regHome", {
      messages,
      details: data,
    });
  });
});

module.exports = router;
