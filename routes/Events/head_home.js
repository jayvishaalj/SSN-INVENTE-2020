var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);

/* View Registered  Participants for Events  */
router.get("/home", (req, res) => {
  try {
    if (
      req.session &&
      req.session.isHeadUser &&
      req.session.isHeadUserLogged &&
      req.session.headUserData.eventId
    ) {
      const sql =
        "select users.name, users.email, users.college, users.year, users.phone from users join attendees on users.id = attendees.userid where attendees.eventid =  ?";
      connection.query(sql, [req.session.headUserData.eventId], (err, data) => {
        if (err) {
          req.flash(
            "error",
            "Oh Snap! Something Happened Please Try Again after sometime!"
          );
          logger.log("error", `Head User HOME DB READ Block Error : ${err}`);
          return res.redirect("/");
        } else {
          console.log(data);
          console.log(req.session.headUserData);
          const messages = req.flash();
          return res.render("headHome", {
            messages,
            username: req.session.headUserData.name,
            event: req.session.headUserData.eventname,
            eventDept: req.session.headUserData.eventdept,
            eventType: req.session.headUserData.eventtype,
            eventDay: req.session.headUserData.eventday,
            users: data,
          });
        }
      });
    } else {
      return res.redirect("/auth/head/login");
    }
  } catch (error) {
    req.flash(
      "error",
      "Oh Snap! Something Happened Please Try Again after sometime!"
    );
    logger.log("error", `Head User HOME  Catch Block Error : ${error}`);
    return res.redirect("/");
  }
});

module.exports = router;
