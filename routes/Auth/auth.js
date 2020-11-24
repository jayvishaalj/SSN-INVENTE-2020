var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);
const bcrypt = require("bcryptjs");
const { userLoginSchema } = require("../Users/schema");
/* GET home page. */
router.get("/login", function (req, res, next) {
  if (req.session.data) {
    console.log("SESSION PRESENT");
    if (req.session.isLogged) {
      logger.log(
        "info",
        `User Already Logged In ${JSON.stringify(req.session.data)}`
      );
      res.redirect("/user/home");
    }
  } else {
    const messages = req.flash();
    res.render("login", { messages });
  }
});

router.post("/login", (req, res) => {
  try {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
      req.flash("error", error.details[0].message);
      logger.log(
        "error",
        `User Login Schema Error ${error.details[0].message}`
      );
      return res.redirect("login");
    } else {
      let sql = `SELECT id, name, password, phone, college, email from users where email = ?`;
      connection.query(sql, req.body.email, async (err, data) => {
        if (err) {
          req.flash(
            "error",
            "Something Happened Please Try Again after sometime!"
          );
          logger.log("error", `User Login  Error ${err}`);
          return res.redirect("login");
        } else {
          if (data.length > 0) {
            const validPass = await bcrypt.compare(
              req.body.password,
              data[0].password
            );
            if (validPass) {
              req.session.data = data[0];
              req.session.isLogged = true;
              logger.log("info", `${req.body.email}  User Logged IN`);
              req.flash("success", "Successfully Logged In!");
              return res.redirect("/user/home");
            } else {
              req.flash("error", "Wrong Credentials");
              logger.log(
                "error",
                `User Login Password MissMatch Error ${JSON.stringify(
                  req.body
                )}`
              );
              return res.redirect("login");
            }
          } else {
            req.flash("error", "No User Found with that Email Please Register");
            logger.log(
              "error",
              `User Login No User Found Error ${JSON.stringify(req.body)}`
            );
            return res.redirect("login");
          }
        }
      });
    }
  } catch (error) {
    req.flash(
      "error",
      "Oh Snap! Something Happened Please Try Again after sometime!"
    );
    logger.log(
      "error",
      `User Login Catch Block Error ${JSON.stringify(
        req.body
      )}, Error : ${error}`
    );
    return res.redirect("login");
  }
});

module.exports = router;
