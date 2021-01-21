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
      let sql = `SELECT events.id as eventId, events.name as event, events.dept as conductingDept, events.day as eventDay, events.link as eventLink, users.name, users.email as email, users.phone, users.paid FROM users JOIN attendees on users.id = attendees.userid JOIN events on events.id = attendees.eventid where users.email = ? `;
      connection.query(sql, req.session.data.email, async (err, data) => {
        if (err) {
          req.flash("error", "Oops something went wrong !");
          logger.log("error", `User Profile  Error ${err}`);
          return res.redirect("/user/home");
        } else {
          console.log(data);
          if (data.length > 0) {
            sql = `SELECT id, name, dept, day from workshops where id  = (SELECT workshopId from users where email = ?)`;
            connection.query(
              sql,
              [req.session.data.email],
              (errSub, dataSub) => {
                if (errSub) {
                  req.flash("error", "Oops something went wrong !");
                  logger.log("error", `User Profile  Error ${errSub}`);
                  return res.redirect("/user/home");
                } else {
                  console.log(dataSub);
                  return res.render("register_events_closed", {
                    messages,
                    isLogged: req.session.isLogged,
                    events: data,
                  });
                }
              }
            );
          } else {
            sql = `SELECT name, password, phone, college, email, paid, workshopPaid from users where email = ?`;
            connection.query(
              sql,
              req.session.data.email,
              async (errSub, dataSub) => {
                if (errSub) {
                  req.flash("error", "Oops something went wrong !");
                  logger.log("error", `User Profile  Error ${errSub}`);
                  return res.redirect("/user/home");
                } else {
                  sql = `SELECT id, name, dept, day from workshops where id  = (SELECT workshopId from users where email = ?)`;
                  connection.query(
                    sql,
                    [req.session.data.email],
                    (errSub1, dataSub1) => {
                      if (errSub) {
                        req.flash("error", "Oops something went wrong !");
                        logger.log("error", `User Profile  Error ${errSub1}`);
                        return res.redirect("/user/home");
                      } else {
                        return res.render("profile", {
                          messages,
                          username: req.session.data.name,
                          email: req.session.data.email,
                          dept: req.session.data.dept,
                          year: req.session.data.year,
                          regno: req.session.data.regno,
                          college: req.session.data.college,
                          isLogged: req.session.isLogged,
                          paid: dataSub[0].paid,
                          phone: dataSub[0].phone,
                          workshopPaid: dataSub[0].workshopPaid,
                          workshop: dataSub1[0],
                        });
                      }
                    }
                  );
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
