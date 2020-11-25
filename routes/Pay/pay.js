var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);

/* GET Payment Page */
router.get("/", function (req, res, next) {
  const messages = req.flash();
  if (req.session.isLogged) {
    if (req.session.data) {
      let sql = "SELECT paid from users where email = ? ";
      connection.query(sql, [req.session.data.email], (err, data) => {
        if (err) {
          req.flash(
            "error",
            "Oops something went wrong Coudln't Initiate Payment!"
          );
          logger.log("error", `User Payment Page Error ${err}`);
          return res.redirect("/user/home");
        } else {
          logger.log(
            "info",
            `User Entered Payment Page ${req.session.data.name}`
          );
          req.session.data.paid = data[0].paid;
          return res.render("pay", {
            messages,
            username: req.session.data.name,
            isLogged: req.session.isLogged,
            paid100: data[0].paid === 100,
            paid200: data[0].paid === 200,
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

/* Payment POST API  */

router.post("/", (req, res) => {
  logger.log(
    "info",
    `User Initiated a PAYMENT ${req.session.data.email}, ${req.body.amount} `
  );
  if (req.session.data.paid === 200) {
    req.flash("error", "You have Already paid the MAX amount!");
    logger.log("error", `User Repayment 200 Payment Error`);
    return res.redirect("/user/home");
  } else {
    if (req.session.data.paid === 100) {
      let sql = `UPDATE users SET paid = 200 where email = ?`;
      connection.query(sql, [req.session.data.email], (err, data) => {
        if (err) {
          req.flash(
            "error",
            "Oops something went wrong Coudln't Initiate Payment!"
          );
          logger.log("error", `User Payment API Error ${err}`);
          return res.redirect("/pay");
        } else {
          req.flash("success", `You Have Sucessfully Paid ₹100`);
          logger.log(
            "info",
            `User made a PAYMENT ${req.session.data.email}, 100`
          );
          return res.redirect("/user/home");
        }
      });
    } else {
      let sql = `UPDATE users SET paid = ? where email = ?`;
      connection.query(
        sql,
        [req.body.amount, req.session.data.email],
        (err, data) => {
          if (err) {
            req.flash(
              "error",
              "Oops something went wrong Coudln't Initiate Payment!"
            );
            logger.log("error", `User Payment API Error ${err}`);
            return res.redirect("/pay");
          } else {
            req.flash(
              "success",
              `You Have Sucessfully Paid ₹${req.body.amount}`
            );
            logger.log(
              "info",
              `User made a PAYMENT ${req.session.data.email}, ${req.body.amount}`
            );
            return res.redirect("/event/register");
          }
        }
      );
    }
  }
});

module.exports = router;
