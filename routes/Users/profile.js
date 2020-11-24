var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);
/* GET users listing. */
router.get("/", function (req, res, next) {
  const messages = req.flash();
  if (req.session.isLogged) {
    if (req.session.data) {
      logger.log("info", `User Entered Profile Page ${req.session.data.name}`);
      console.log("USER EMAIL ", req.session.data);
      let sql = `SELECT events.id as eventId, events.name as event, events.dept as conductingDept, events.day as eventDay, users.name, users.email as email, users.phone, users.day1, users.day2 FROM users JOIN attendees on users.id = attendees.userid JOIN events on events.id = attendees.eventid where users.email = ? `;
      connection.query(sql, req.session.data.email, async (err, data) => {
        if (err) {
          req.flash("error", "Oops something went wrong !");
          logger.log("error", `User Profile  Error ${err}`);
          return res.redirect("/user/home");
        } else {
          console.log(data);
          if (data.length > 0) {
            return res.render("profile", {
              messages,
              username: req.session.data.name,
              isLogged: req.session.isLogged,
              day1: data[0].day1,
              day2: data[0].day2,
              phone: data[0].phone,
              events: data,
            });
          } else {
            sql = `SELECT name, password, phone, college, email, day1, day2 from users where email = ?`;
            connection.query(
              sql,
              req.session.data.email,
              async (errSub, dataSub) => {
                if (errSub) {
                  req.flash("error", "Oops something went wrong !");
                  logger.log("error", `User Profile  Error ${errSub}`);
                  return res.redirect("/user/home");
                } else {
                  return res.render("profile", {
                    messages,
                    username: req.session.data.name,
                    isLogged: req.session.isLogged,
                    day1: dataSub[0].day1,
                    day2: dataSub[0].day2,
                    phone: dataSub[0].phone,
                  });
                }
              }
            );
          }
        }
      });
    } else {
      return res.redirect("/auth/login");
    }
  } else {
    return res.redirect("/auth/login");
  }
});

module.exports = router;
