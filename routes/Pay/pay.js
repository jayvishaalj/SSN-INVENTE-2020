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

router.post("/workshop", (req, res) => {
  try {
    if (req.session.isLogged && req.session.data && req.session.data.email) {
      logger.log("info", "User Initiated For Paying Workshop POST API");
      let sql = "SELECT workshopPaid from users where email = ?";
      connection.query(sql, [req.session.data.email], (err, data) => {
        if (err) {
          req.flash(
            "error",
            "Oh Snap! Something Happened Please Try Again after sometime!"
          );
          logger.log(
            "error",
            `User Pay Workshop DB GET Error ${JSON.stringify(err)}`
          );
          return res.redirect("/event/register");
        } else {
          if (data[0].workshopPaid === 1) {
            req.flash("error", "You Have already Paid Once!");
            logger.log(
              "error",
              `User RePay Workshop Error ${JSON.stringify(data[0])}`
            );
            return res.redirect("/event/register");
          } else {
            sql = `UPDATE users SET workshopPaid = 1 where email = ?`;
            connection.query(
              sql,
              [req.session.data.email],
              (errSub, dataSub) => {
                if (errSub) {
                  req.flash(
                    "error",
                    "Oh Snap! Sorry Unable to Put your Payment entry to our DB! Please Contact our Support!"
                  );
                  logger.log(
                    "error",
                    `User Pay Workshop DB UPDATE Error ${JSON.stringify(
                      errSub
                    )}`
                  );
                  return res.redirect("/event/register");
                } else {
                  req.flash("success", `You Have Sucessfully Paid ₹250`);
                  logger.log(
                    "info",
                    `User made a PAYMENT ${req.session.data.email}, ₹250`
                  );
                  return res.redirect("/event/register");
                }
              }
            );
          }
        }
      });
    } else {
      return res.redirect("/auth/login");
    }
  } catch (error) {
    req.flash(
      "error",
      "Oh Snap! Something Happened Please Try Again after sometime!"
    );
    logger.log(
      "error",
      `User PAY WORKSHOP Catch Block Error ${JSON.stringify(
        req.body
      )}, Error : ${error}`
    );
    return res.redirect("/event/register");
  }
});

module.exports = router;
