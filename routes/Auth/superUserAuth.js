var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);
const bcrypt = require("bcryptjs");
const {
  authSuperUserCheck,
  authSuperUser,
} = require("../middleware/superUserAuth");

router.get("/login", authSuperUserCheck, (req, res) => {
  const messages = req.flash();
  res.render("superLogin", { messages });
});

router.post("/login", authSuperUserCheck, (req, res) => {
  if (req.body.email && req.body.password) {
    console.log("SUPER USER ENTERED", req.body.email);
    let sql = "SELECT id, name, email, password from superuser where email = ?";
    connection.query(sql, [req.body.email], async (err, data) => {
      if (err) {
        req.flash(
          "error",
          "Something Happened Please Try Again after sometime!"
        );
        logger.log("error", `Super User Login  Error ${err}`);
        return res.redirect("login");
      } else {
        if (data.length > 0) {
          data = data[0];
          const validPass = await bcrypt.compare(
            req.body.password,
            data.password
          );
          if (validPass) {
            req.session.superUserData = data;
            req.session.isSuperUser = true;
            req.session.isSuperUserLogged = true;
            logger.log("info", `${req.body.email} Super User Logged IN`);
            req.flash("success", "Successfully Logged In!");
            return res.redirect("/super/home");
          } else {
            req.flash("error", "Wrong Credentials");
            logger.log(
              "error",
              `User Login Password MissMatch Error ${JSON.stringify(req.body)}`
            );
            return res.redirect("login");
          }
        }
      }
    });
  } else {
    logger.log(
      "error",
      ` Super User Login No username or password ${JSON.stringify(req.body)}`
    );
    req.flash("error", "Please Enter the email and password!");
    return res.redirect("login");
  }
});

router.get("/logout", authSuperUser, function (req, res, next) {
  console.log("SUPER LOGIN SESSION PRESENT");
  logger.log("info", `User Logging Out ${JSON.stringify(req.session.data)}`);
  req.session.superUserData = null;
  req.session.isSuperUser = false;
  req.session.isSuperUserLogged = false;
  req.session.destroy(function (err) {
    if (err) {
      logger.log("error", `User Logout Error ${JSON.stringify(err)}`);
      req.flash("error", "Oops! Something Happened! Unable to Logout!");
      return res.redirect("/super/home");
    } else {
      logger.log("info", `User Logged Out Successfully`);
      return res.redirect("login");
    }
  });
});

module.exports = router;
