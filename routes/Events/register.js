var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);

/* Register for Events Page */
router.get("/", function (req, res, next) {
  const messages = req.flash();
  if (req.session.isLogged) {
    if (req.session.data) {
      logger.log(
        "info",
        `User Entered Register Event Page ${req.session.data.name}`
      );
      let sql = `SELECT id, name, dept, day from events`;
      connection.query(sql, [], (err, data) => {
        if (err) {
          req.flash("error", "Oops something went wrong !");
          logger.log("error", `Register Event Error ${err}`);
          return res.redirect("/user/home");
        } else {
          console.log(data);
          return res.render("register-event", {
            messages,
            username: req.session.data.name,
            isLogged: req.session.isLogged,
            events: data,
          });
        }
      });
    } else {
      return res.redirect("/auth/login");
    }
  } else {
    return res.redirect("/auth/login");
  }
});

/* Register for Events POST API */
router.post("/", (req, res) => {
  console.log("Register EVENT body : ", req.body);
  let sql =
    "SELECT COUNT(attendees.eventid) as registeredEventCount, users.id as userId, users.paid as paid FROM attendees JOIN users ON users.id = attendees.userid WHERE users.email = ? ";
  connection.query(sql, [req.session.data.email], (err, data) => {
    if (err) {
      req.flash("error", "Oops something went wrong !");
      logger.log("error", `Register Event POST Error ${err}`);
      return res.redirect("register");
    } else {
      console.log("COUNT DATA ", data[0].registeredEventCount);
      if (data[0].paid == 100) {
        if (data[0].registeredEventCount < 3) {
          sql = `INSERT INTO attendees (eventid, userid) VALUES (? ,?)`;
          connection.query(
            sql,
            [req.body.eventId, data[0].userId],
            (errSub, dataSub) => {
              if (errSub) {
                if (errSub.code === "ER_DUP_ENTRY") {
                  req.flash("error", "Already Registered For this Event");
                  return res.redirect("register");
                } else if (errSub.code === "ER_NO_REFERENCED_ROW_2") {
                  req.flash("error", "Event or User Not found!");
                  logger.log("error", `Register Event POST Error ${errSub}`);
                  return res.redirect("register");
                } else {
                  req.flash("error", "Oops something went wrong !");
                  logger.log("error", `Register Event POST Error ${errSub}`);
                  return res.redirect("register");
                }
              } else {
                req.flash(
                  "success",
                  `register for the Event ${req.body.eventId}`
                );
                logger.log(
                  "success",
                  `User Registed For a new Event ${req.body.eventId} by user ${data[0].userId}`
                );
                return res.redirect("register");
              }
            }
          );
        } else {
          req.flash("error", `Oops!, Already Registered For Limited Events!`);
          return res.redirect("register");
        }
      } else if (data[0].paid == 200) {
        if (data[0].registeredEventCount < 6) {
          sql = `INSERT INTO attendees (eventid, userid) VALUES (? ,?)`;
          connection.query(
            sql,
            [req.body.eventId, data[0].userId],
            (errSub, dataSub) => {
              if (errSub) {
                if (errSub.code === "ER_DUP_ENTRY") {
                  req.flash("error", "Already Registered For this Event");
                  return res.redirect("register");
                } else if (errSub.code === "ER_NO_REFERENCED_ROW_2") {
                  req.flash("error", "Event or User Not found!");
                  logger.log("error", `Register Event POST Error ${errSub}`);
                  return res.redirect("register");
                } else {
                  req.flash("error", "Oops something went wrong !");
                  logger.log("error", `Register Event POST Error ${errSub}`);
                  return res.redirect("register");
                }
              } else {
                req.flash(
                  "success",
                  `register for the Event ${req.body.eventId}`
                );
                logger.log(
                  "success",
                  `User Registed For a new Event ${req.body.eventId} by user ${data[0].userId}`
                );
                return res.redirect("register");
              }
            }
          );
        } else {
          req.flash("error", `Oops!, Already Registered For Limited Events!`);
          return res.redirect("register");
        }
      } else {
        req.flash("error", "Please Pay to Register for the events !");
        return res.redirect("/pay");
      }
    }
  });
});

module.exports = router;
