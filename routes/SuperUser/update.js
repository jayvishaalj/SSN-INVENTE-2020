var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);
const { authSuperUser } = require("../middleware/superUserAuth");

router.post("/", authSuperUser, (req, res) => {
  if (
    req.session.superUserData &&
    req.session.superUserData.email &&
    req.body.email &&
    req.body.transno &&
    req.body.amount &&
    req.body.regno
  ) {
    let sql = "SELECT id, paid from users where email = ? and regno = ?";
    connection.query(sql, [req.body.email, req.body.regno], (err, data) => {
      if (err) {
        req.flash(
          "error",
          "Something Happened Please Try Again after sometime!"
        );
        logger.log("error", `Super User DB UPDATE REPORT Error ${err}`);
        return res.redirect("/super/home");
      } else {
        if (data.length > 0) {
          sql =
            "INSERT INTO updatedby (superuserid, userid, useremail, transactionid, amount) VALUES (?,?,?,?,?)";
          connection.query(
            sql,
            [
              req.session.superUserData.id,
              data[0].id,
              req.body.email,
              req.body.transno,
              req.body.amount,
            ],
            (errSub, dataSub) => {
              if (errSub) {
                if (errSub.code == "ER_DUP_ENTRY") {
                  req.flash(
                    "error",
                    "Duplicate Entry! User already paid that amount or already updated!"
                  );
                  logger.log(
                    "error",
                    `Super User DB DUPLICATE UPDATE REPORT Error ${errSub}`
                  );
                  return res.redirect("/super/home");
                } else {
                  req.flash(
                    "error",
                    "Something Happened Please Try Again after sometime!"
                  );
                  logger.log(
                    "error",
                    `Super User DB UPDATE REPORT Error ${errSub}`
                  );
                  return res.redirect("/super/home");
                }
              } else {
                sql = "UPDATE users SET paid = paid + ? where email = ?";
                connection.query(
                  sql,
                  [req.body.amount, req.body.email],
                  (errMain, dataMain) => {
                    console.log("DATA MAIN : ", dataMain);
                    if (errMain) {
                      req.flash(
                        "error",
                        "Something Happened Please Try Again after sometime!"
                      );
                      logger.log(
                        "error",
                        `Super User DB UPDATE REPORT Error ${errMain}`
                      );
                      return res.redirect("/super/home");
                    } else {
                      req.flash("success", "Successfully Updated!");
                      logger.log(
                        "info",
                        `Super User Updated user payment ${JSON.stringify(
                          req.body
                        )} -> ${JSON.stringify(req.session.superUserData)}`
                      );
                      return res.redirect("/super/home");
                    }
                  }
                );
              }
            }
          );
        } else {
          req.flash("error", "No User with that email Id and Regno");
          logger.log(
            "error",
            `Super User No User with that email Id REPORT Error`
          );
          return res.redirect("/super/home");
        }
      }
    });
  } else {
    req.flash("error", "Oops! Something Happened Please Try Loging In Again!");
    logger.log("error", `Super User Login  Error ${err}`);
    return res.redirect("/super/home");
  }
});

module.exports = router;
