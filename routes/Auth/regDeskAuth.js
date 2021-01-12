var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);
const bcrypt = require("bcryptjs");
const {
  authRegUser,
  authRegUserCheck,
} = require("../middleware/superUserAuth");

router.get("/login", authRegUserCheck, (req, res) => {
  const messages = req.flash();
  res.render("regDeskLogin", { messages });
});

router.get("/logout", authRegUser, function (req, res, next) {
  console.log("Reg Desk LOGIN SESSION PRESENT");
  logger.log(
    "info",
    `Reg Desk User Logging Out ${JSON.stringify(req.session.data)}`
  );
  req.session.isRegUser = false;
  req.session.isRegUserLogged = false;
  req.session.destroy(function (err) {
    if (err) {
      logger.log("error", `Reg Desk User Logout Error ${JSON.stringify(err)}`);
      req.flash("error", "Oops! Something Happened! Unable to Logout!");
      return res.redirect("/reg/home");
    } else {
      logger.log("info", `Reg Desk User Logged Out Successfully`);
      return res.redirect("login");
    }
  });
});

router.post("/login", authRegUserCheck, (req, res) => {
  if (req.body.email && req.body.password) {
    console.log("Reg Desk USER ENTERED", req.body.email);
    if (
      req.body.email == "regdesk@invente.com" &&
      req.body.password == "regdeskinvente2021"
    ) {
      req.session.isRegUser = true;
      req.session.isRegUserLogged = true;
      logger.log("info", `${req.body.email} Reg User Logged IN`);
      req.flash("success", "Successfully Logged In!");
      return res.redirect("/reg/home");
    }
  } else {
    req.flash("error", "Wrong Credentials");
    logger.log(
      "error",
      `Reg User Login Password MissMatch Error ${JSON.stringify(req.body)}`
    );
    return res.redirect("login");
  }
});
module.exports = router;
