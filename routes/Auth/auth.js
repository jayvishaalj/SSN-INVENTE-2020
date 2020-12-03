var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {
  userLoginSchema,
  userRegisterSchema,
  userResetPasswordSchema,
} = require("../Users/schema");
const { sendMail } = require("../middleware/sendmail");

/* GET Login page. */
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

/* Forgot Password Page */

router.get("/forgot-password", (req, res) => {
  const messages = req.flash();
  return res.render("forgot-password", { messages });
});

/* Password Reset Page */

router.get("/reset/:token", (req, res) => {
  try {
    let sql = "SELECT email, expires from pwdreset where token = ?";
    connection.query(sql, [req.params.token], (err, data) => {
      if (err) {
        req.flash("error", "Sorry Wrong Token! Try forgot password Again!");
        logger.log(
          "error",
          `User Reset Password Page Catch Block Error ${JSON.stringify(
            req.params.token
          )}, Error : ${err}`
        );
        return res.redirect("/auth/login");
      } else {
        if (data.length > 0) {
          req.flash("success", "Please Enter your new Password!");
          logger.log(
            "info",
            `User Reset Password Page Rendered ${JSON.stringify(
              req.params.token
            )}`
          );
          req.session.resetPasswordToken = req.params.token;
          req.session.email = data[0].email;
          req.session.resetPasswordTokenExpires = data[0].expires;
          return res.render("reset-password", { messages: req.flash() });
        } else {
          req.flash("error", "Sorry Wrong Token! Try forgot password Again!");
          return res.redirect("/auth/login");
        }
      }
    });
  } catch (error) {
    req.flash(
      "error",
      "Oh Snap! Something Happened Please Try Again after sometime!"
    );
    logger.log(
      "error",
      `User Reset Password Page Catch Block Error ${JSON.stringify(
        req.params.token
      )}, Error : ${error}`
    );
    return res.redirect("login");
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
      let sql = `SELECT id, name, password, phone, college, email, dept, regno, year from users where email = ?`;
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
                dept: req.body.dept,
                year: req.body.year,
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
  } catch (error) {
    req.flash(
      "error",
      "Oh Snap! Something Happened Please Try Again after sometime!"
    );
    logger.log(
      "error",
      `User Register Catch Block Error ${JSON.stringify(
        req.body
      )}, Error : ${error}`
    );
    return res.redirect("register");
  }
});

/* forgot Password API */
router.post("/forgot-password", (req, res) => {
  try {
    if (req.body.email === undefined) {
      req.flash("error", "Please enter a valid email");
      return res.redirect("forgot-password");
    } else {
      let SuperSql = "SELECT id from users where email = ?";
      connection.query(SuperSql, [req.body.email], (errSuper, dataSuper) => {
        if (errSuper) {
          req.flash(
            "error",
            "Oh Snap! Something Happened Please Try Again after sometime!"
          );
          logger.log(
            "error",
            `User Forgot Password EMAIL Error ${JSON.stringify(
              req.body
            )}, Error : ${err}`
          );
          return res.redirect("forgot-password");
        } else {
          if (dataSuper.length < 1) {
            req.flash("error", "Sorry Email you specified doesn't Exist!");
            return res.redirect("forgot-password");
          } else {
            crypto.randomBytes(20, (err, buf) => {
              if (err) {
                req.flash(
                  "error",
                  "Oh Snap! Something Happened Please Try Again after sometime!"
                );
                logger.log(
                  "error",
                  `User Forgot Password CRYPTO Error ${JSON.stringify(
                    req.body
                  )}, Error : ${err}`
                );
                return res.redirect("forgot-password");
              } else {
                let token = buf.toString("hex");
                let expires = Date.now() + 3600000;
                let sql =
                  "INSERT INTO pwdreset (email, token, expires) VALUES (?,?,?) ";
                connection.query(
                  sql,
                  [req.body.email, token, expires],
                  (err, data) => {
                    if (err) {
                      req.flash(
                        "error",
                        "Oh Snap! Something Happened Please Try Again after sometime!"
                      );
                      logger.log(
                        "error",
                        `User Forgot Password Write DB Error ${JSON.stringify(
                          req.body
                        )}, Error : ${err}`
                      );
                      return res.redirect("forgot-password");
                    } else {
                      sendMail(req.body.email, token, req.headers.host).then(
                        (mailinfo, mailerr) => {
                          if (mailerr) {
                            req.flash(
                              "error",
                              "Oh Snap! Something Happened Please Try Again after sometime!"
                            );
                            logger.log(
                              "error",
                              `User Forgot Password Write DB Error ${JSON.stringify(
                                req.body
                              )}, Error : ${err}`
                            );
                            return res.redirect("forgot-password");
                          } else {
                            logger.log(
                              "info",
                              `User Forgot Password ${JSON.stringify(
                                req.body.email
                              )}, token : ${token}, expires: ${expires}`
                            );
                            req.flash(
                              "success",
                              "An Email with further instructions is sent to " +
                                req.body.email
                            );
                            return res.redirect("/auth/login");
                          }
                        }
                      );
                    }
                  }
                );
              }
            });
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
      `User Forgot Password Catch Block Error ${JSON.stringify(
        req.body
      )}, Error : ${error}`
    );
    return res.redirect("forgot-password");
  }
});

/* Password Reset API */
router.post("/reset", async (req, res) => {
  try {
    const { error } = userResetPasswordSchema.validate(req.body);
    if (error) {
      req.flash("error", error.details[0].message);
      logger.log(
        "error",
        `User Password Reset Schema Error ${JSON.stringify(error)}`
      );
      return res.redirect("/auth/reset/" + req.session.resetPasswordToken);
    } else {
      if (req.session.resetPasswordToken && req.session.email) {
        if (req.session.resetPasswordTokenExpires >= Date.now()) {
          let password = await bcrypt.hash(req.body.password, 10);
          let sql = "UPDATE users SET password = ? where email = ?";
          connection.query(sql, [password, req.session.email], (err, data) => {
            if (err) {
              req.flash(
                "error",
                "Oh Snap! Something Happened Please Try Again after sometime!"
              );
              logger.log(
                "error",
                `User Reset Password DB Error ${JSON.stringify(
                  req.body
                )}, Error : ${err}`
              );
              return res.redirect(
                "/auth/reset/" + req.session.resetPasswordToken
              );
            } else {
              req.flash("success", "Your Password  is reset Successfully!");
              logger.log(
                "info",
                `User Reset Password Done ${JSON.stringify(
                  req.body
                )}, email : ${req.session.email}, token : ${
                  req.session.resetPasswordToken
                }`
              );
              sql = "DELETE FROM pwdreset WHERE token = ?";
              connection.query(
                sql,
                [req.session.resetPasswordToken],
                (errSub, dataSub) => {
                  if (errSub) {
                    logger.log(
                      "error",
                      `User Reset Password REMOVE TOKEN DB Error ${req.session.resetPasswordToken}, Error : ${errSub}`
                    );
                  } else {
                    logger.log(
                      "info",
                      `User Reset Passsword REMOVED TOKEN SUCCSES ${req.session.resetPasswordToken}`
                    );
                  }
                  req.session.resetPasswordToken = null;
                  req.session.resetPasswordTokenExpires = null;
                  return res.redirect("/auth/login");
                }
              );
            }
          });
        } else {
          req.flash(
            "error",
            "Oh Snap! Your password reset is Timed OUT! Please try forgot password again!"
          );
          logger.log(
            "error",
            `User Token Timed OUT ${req.session.email}, token : ${req.session.resetPasswordToken}`
          );
          return res.redirect("/auth/login");
        }
      } else {
        req.flash(
          "error",
          "Oh Snap! Something wrong with your sessions and token! Please try agian"
        );
        logger.log(
          "error",
          `User Reset Password SESSION Block Error ${JSON.stringify(
            req.session
          )}, Error : Sessions Are not available`
        );
        return res.redirect("/auth/login");
      }
    }
  } catch (error) {
    req.flash(
      "error",
      "Oh Snap! Something Happened Please Try Again after sometime!"
    );
    logger.log(
      "error",
      `User Reset Password Catch Block Error ${JSON.stringify(
        req.body
      )}, Error : ${error}`
    );
    return res.redirect("/auth/reset/" + req.session.resetPasswordToken);
  }
});

module.exports = router;
