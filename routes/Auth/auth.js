var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);
const bcrypt = require("bcryptjs");
const { userLoginSchema, userRegisterSchema } = require("../Users/schema");

/* GET Login page. */
router.get("/login", function (req, res, next) {
  logger.info("This is a debug log.", {
    key1: "value1",
    key2: "value2",
    key3: "value3",
  });
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

/* GET Signup page. */
router.get("/signup", function (req, res, next) {
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
    res.render("signup", { messages });
  }
});

/* Logout Functionality */
router.get("/logout", function (req, res, next) {
  if (req.session.data) {
    console.log("LOGIN SESSION PRESENT");
    if (req.session.isLogged) {
      logger.log(
        "info",
        `User Logging Out ${JSON.stringify(req.session.data)}`
      );
      req.session.isLogged = false;
      req.session.destroy(function (err) {
        if (err) {
          logger.log("error", `User Logout Error ${JSON.stringify(err)}`);
          req.flash("error", "Oops! Something Happened! Unable to Logout!");
          return res.redirect("/user/home");
        } else {
          logger.log("info", `User Logged Out Successfully`);
          return res.redirect("login");
        }
      });
    } else {
      return res.redirect("login");
    }
  } else {
    return res.redirect("login");
  }
});

/**
 * All POST methods for handling the Auth Form Requests
 */

/* Login API */
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

/* Register API */
router.post("/register", async (req, res) => {
  try {
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      req.flash("error", error.details[0].message);
      logger.log(
        "error",
        `User Register Schema Error ${JSON.stringify(error)}`
      );
      return res.redirect("signup");
    } else {
      const password = await bcrypt.hash(req.body.password, 10);
      logger.log("info", ` User Registering ${JSON.stringify(req.body)}`);
      let sql = `INSERT INTO users (name, password, email, phone, college, regno, dept, year) VALUES (?,?,?,?,?,?,?,?)`;
      connection.query(
        sql,
        [
          req.body.name,
          password,
          req.body.email,
          req.body.phno,
          req.body.college,
          req.body.regno,
          req.body.dept,
          req.body.year,
        ],
        (err, data) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              req.flash("error", "User Already Exists! Please try to Login!");
              logger.log("error", `User Register Already Exists Error ${err}`);
              return res.redirect("login");
            } else {
              req.flash(
                "error",
                "Something Happened Please Try Again after sometime!"
              );
              logger.log("error", `User Login  Error ${err}`);
              return res.redirect("signup");
            }
          } else {
            const data = [
              {
                name: req.body.name,
                email: req.body.email,
                phno: req.body.phno,
                college: req.body.college,
                regno: req.body.regno,
              },
            ];
            req.session.data = data[0];
            req.session.isLogged = true;
            logger.log(
              "info",
              `${req.body.email}  User Registered and Logged IN`
            );
            req.flash("success", "Successfully Logged In!");
            return res.redirect("/user/home");
          }
        }
      );
    }
  } catch (error) {}
});

module.exports = router;
