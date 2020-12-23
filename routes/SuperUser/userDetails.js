var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);
const { authSuperUser } = require("../middleware/superUserAuth");

router.post("/details", authSuperUser, (req, res) => {
  if (req.body.email && req.body.regno) {
    let sql = "SELECT name, paid from users where email = ? and regno = ?";
    connection.query(sql, [req.body.email, req.body.regno], (err, data) => {
      if (err) {
        req.flash("error", "Oops Something went wrong !");
        logger.log("error", `Search User Payment POST REPORT Error ${err}`);
        return res.redirect("/super/home");
      } else {
        if (data.length > 0) {
          req.session.searchedUserName = data[0].name;
          req.session.amountPaid = data[0].paid;
          return res.redirect("/super/home");
        } else {
          req.flash("error", "Sorry user Not Found");
          console.log("USER NOT FOUND");
          req.session.searchedUserName = null;
          req.session.amountPaid = null;
          return res.redirect("/super/home");
        }
      }
    });
  } else {
    req.flash("error", "Pls Fill up the form!");
    logger.log("error", `Search User Payment POST Body Error ${req.body}`);
    return res.redirect("/super/home");
  }
});

module.exports = router;
