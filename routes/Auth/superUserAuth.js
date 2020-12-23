var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);
const bcrypt = require("bcryptjs");
const {
  authSuperUserCheck,
  authSuperUser,
} = require("../middleware/superUserAuth");
const crypto = require("crypto");
const { userResetPasswordSchema } = require("../Users/schema");
const { sendSuperMail } = require("../middleware/sendmail");

router.get("/login", authSuperUserCheck, (req, res) => {
  const messages = req.flash();
  res.render("superLogin", { messages });
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
        return res.redirect("/auth/super/login");
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
          return res.render("reset-password-super-user", {
            messages: req.flash(),
          });
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

router.post("/reset-password", (req, res) => {
  try {
    if (req.body.email === undefined) {
      return res.status(400).json({ message: "Please enter a valid email" });
    } else {
      let SuperSql = "SELECT id from superuser where email = ?";
      connection.query(SuperSql, [req.body.email], (errSuper, dataSuper) => {
        if (errSuper) {
          logger.log(
            "error",
            `Super User Forgot Password EMAIL Error ${JSON.stringify(
              req.body
            )}, Error : ${errSuper}`
          );
          return res.status(400).json({ message: "DB ERROR" });
        } else {
          if (dataSuper.length < 1) {
            req.flash("error", "Sorry Email you specified doesn't Exist!");
            return res
              .status(400)
              .json({ message: "Sorry Email you specified doesn't Exist!" });
          } else {
            crypto.randomBytes(20, (err, buf) => {
              if (err) {
                logger.log(
                  "error",
                  `Super User Forgot Password CRYPTO Error ${JSON.stringify(
                    req.body
                  )}, Error : ${err}`
                );
                return res.status(400).json({
                  message: "Crypto Error",
                  err: err,
                });
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
                      logger.log(
                        "error",
                        `User Forgot Password Write DB Error ${JSON.stringify(
                          req.body
                        )}, Error : ${err}`
                      );
                      return res.status(400).json({
                        message: "Crypto Error",
                        err: err,
                      });
                    } else {
                      sendSuperMail(
                        req.body.email,
                        token,
                        req.headers.host
                      ).then((mailinfo, mailerr) => {
                        if (mailerr) {
                          logger.log(
                            "error",
                            `User Forgot Password Write DB Error ${JSON.stringify(
                              req.body
                            )}, Error : ${mailerr}`
                          );
                          return res.status(400).json({
                            message: "Mail Error",
                            err: mailerr,
                          });
                        } else {
                          logger.log(
                            "info",
                            `User Forgot Password ${JSON.stringify(
                              req.body.email
                            )}, token : ${token}, expires: ${expires}`
                          );
                          return res.status(200).json({
                            message:
                              "An Email with further instructions is sent to " +
                              req.body.email,
                          });
                        }
                      });
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
    logger.log(
      "error",
      `Super User Forgot Password Catch Block Error ${JSON.stringify(
        req.body
      )}, Error : ${error}`
    );
    return res.status(400).json({
      message: `Super User Forgot Password Catch Block Error ${JSON.stringify(
        req.body
      )}`,
      err: error,
    });
  }
});

router.post("/reset", async (req, res) => {
  try {
    const { error } = userResetPasswordSchema.validate(req.body);
    if (error) {
      req.flash("error", error.details[0].message);
      logger.log(
        "error",
        `Super User Password Reset Schema Error ${JSON.stringify(error)}`
      );
      return res.redirect(
        "/auth/super/reset/" + req.session.resetPasswordToken
      );
    } else {
      if (req.session.resetPasswordToken && req.session.email) {
        if (req.session.resetPasswordTokenExpires >= Date.now()) {
          let password = await bcrypt.hash(req.body.password, 10);
          let sql = "UPDATE superuser SET password = ? where email = ?";
          connection.query(sql, [password, req.session.email], (err, data) => {
            if (err) {
              req.flash(
                "error",
                "Oh Snap! Something Happened Please Try Again after sometime!"
              );
              logger.log(
                "error",
                `Super User Reset Password DB Error ${JSON.stringify(
                  req.body
                )}, Error : ${err}`
              );
              return res.redirect(
                "/auth/super/reset/" + req.session.resetPasswordToken
              );
            } else {
              req.flash("success", "Your Password  is reset Successfully!");
              logger.log(
                "info",
                `Super User Reset Password Done ${JSON.stringify(
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
                  return res.redirect("/auth/super/login");
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
          return res.redirect("/auth/super/login");
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
        return res.redirect("/auth/super/login");
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
    return res.redirect("/auth/super/reset/" + req.session.resetPasswordToken);
  }
});

module.exports = router;
