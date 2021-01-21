var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const logger = require("../../config/logger")(module);

/* Register for Events Page */
router.get("/", function (req, res, next) {
  const messages = req.flash();
  if (req.session.isLogged) {
    if (req.session.data) {
      logger.log(
        "info",
        `User Entered Register Event Page ${req.session.data.name}`
      );
      let sql = `SELECT events.id, events.name, events.type, events.dept, events.day ,events.time from events`;
      connection.query(sql, [], (err, data) => {
        if (err) {
          req.flash("error", "Oops something went wrong !");
          logger.log("error", `Register Event Error ${err}`);
          return res.redirect("/user/home");
        } else {
          sql = `SELECT id, name, dept, day from workshops`;
          connection.query(sql, [req.session.data.email], (errSub, dataSub) => {
            if (errSub) {
              req.flash("error", "Oops something went wrong !");
              logger.log("error", `Register Event Error ${err}`);
              return res.redirect("/user/home");
            } else {
              // console.log(dataSub);
              // console.log(data);
              return res.render("register-event", {
                messages,
                username: req.session.data.name,
                isLogged: req.session.isLogged,
                events: data,
                workshop: dataSub,
              });
            }
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

router.post("/workshop", (req, res) => {
  try {
    if (req.session.isLogged && req.session.data && req.session.data.email) {
      logger.log(
        "info",
        `${JSON.stringify(
          req.session.data
        )} User initiated the WORKSHOP REGISTER ${JSON.stringify(req.body)}`
      );
      let sql = "SELECT workshopPaid, workshopId from users where email = ?";
      connection.query(sql, [req.session.data.email], (err, data) => {
        if (err) {
          req.flash("error", "Oops something went wrong !");
          logger.log("error", `Register Workshop POST DB Error ${err}`);
          return res.redirect("/user/home");
        } else {
          console.log(data[0]);
          if (data[0].workshopPaid === 1) {
            if (data[0].workshopId === null) {
              sql = "UPDATE users SET workshopId = ? where email = ? ";
              connection.query(
                sql,
                [req.body.workshopId, req.session.data.email],
                (errSub, dataSub) => {
                  if (errSub) {
                    req.flash(
                      "error",
                      "Oops Wrong Workshop Id Please Select a Workshop From the List Given Below!"
                    );
                    logger.log(
                      "error",
                      `Register Workshop POST DB FETCH WORKSHOP ID ${JSON.stringify(
                        req.body
                      )} Error ${JSON.stringify(errSub)}`
                    );
                    return res.redirect("/user/home");
                  } else {
                    req.flash(
                      "success",
                      "You Have Successfully Registered For the Workshop!"
                    );
                    logger.log(
                      "info",
                      `User Registered for WORKSHOP ${JSON.stringify(
                        req.body
                      )} ${req.session.data.email}`
                    );
                    return res.redirect("/event/register");
                  }
                }
              );
            } else {
              req.flash(
                "error",
                "You Have already Registered For One Workshop!"
              );
              return res.redirect("/event/register");
            }
          } else {
            req.flash("error", "Please Pay to Register for the workshops !");
            return res.redirect("/pay");
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
    logger.log("error", `User WORKSHOP REGISTER Catch Block Error : ${error}`);
    return res.redirect("/event/register");
  }
});

/* Register for Events POST API */
router.post("/", (req, res) => {
  console.log("Register EVENT body : ", req.body, req.session.data);
  let sql =
    "SELECT COUNT(attendees.eventid) as registeredEventCount, users.id as userId, users.paid as paid FROM attendees JOIN users ON users.id = attendees.userid WHERE users.email = ? ";
  connection.query(sql, [req.session.data.email], (err, data) => {
    if (err) {
      req.flash("error", "Oops something went wrong !");
      logger.log("error", `Register Event POST Error ${err}`);
      return res.redirect("register");
    } else {
      console.log("COUNT DATA ", data[0]);
      if (data[0].registeredEventCount === 0) {
        sql = "SELECT paid, id as userId from users where email = ?";
        connection.query(sql, [req.session.data.email], (errSub1, dataSub) => {
          if (errSub1) {
            req.flash(
              "error",
              "Oops something went wrong ! Refresh and try Again!"
            );
            logger.log("error", `Register Event POST errSub1 Error ${errSub1}`);
            return res.redirect("register");
          } else {
            //code for non techincal event register
            sql = "SELECT type from events where id =?";
            connection.query(sql, [req.body.eventId], (errType, dataType) => {
              if (errType) {
                if (errSub.code === "ER_NO_REFERENCED_ROW_2") {
                  req.flash("error", "Event Not found! Please Refresh");
                  logger.log(
                    "error",
                    `Register Event POST errSub Error ${errType}`
                  );
                  return res.redirect("register");
                } else {
                  req.flash("error", "Oops something went wrong !");
                  logger.log("error", `Register Event POST Error ${errType}`);
                  return res.redirect("register");
                }
              } else {
                console.log("HERE % DATA TYEP : ", dataType);
                dataType = dataType[0];
                console.log("HERE % DATA TYPE : ", dataType, dataSub[0]);
                if (dataType.type) {
                  if (
                    dataSub[0].paid == 100 &&
                    dataType.type == "Non Technical"
                  ) {
                    sql = `INSERT INTO attendees (eventid, userid) VALUES (? ,?)`;
                    connection.query(
                      sql,
                      [req.body.eventId, dataSub[0].userId],
                      (errSub, dataSub2) => {
                        if (errSub) {
                          if (errSub.code === "ER_DUP_ENTRY") {
                            console.log("HERE SUB 100 FIRST", errSub);
                            req.flash("success", "Registered For this Event");
                            // req.flash(
                            //   "error",
                            //   "Already Registered For this Event"
                            // );
                            return res.redirect("register");
                          } else if (errSub.code === "ER_NO_REFERENCED_ROW_2") {
                            req.flash("error", "Event or User Not found!");
                            logger.log(
                              "error",
                              `Register Event POST errSub Error ${errSub}`
                            );
                            return res.redirect("register");
                          } else {
                            req.flash("error", "Oops something went wrong !");
                            logger.log(
                              "error",
                              `Register Event POST Error ${errSub}`
                            );
                            return res.redirect("register");
                          }
                        } else {
                          req.flash(
                            "success",
                            `register for the Event ${req.body.eventId}`
                          );
                          logger.log(
                            "success",
                            `User Registed For a new Event ${req.body.eventId} by user ${dataSub[0].userId}`
                          );
                          return res.redirect("register");
                        }
                      }
                    );
                  } else if (
                    dataSub[0].paid == 150 &&
                    dataType.type == "Technical"
                  ) {
                    //code for techincal event register
                    sql = `INSERT INTO attendees (eventid, userid) VALUES (? ,?)`;
                    connection.query(
                      sql,
                      [req.body.eventId, dataSub[0].userId],
                      (errSub, dataSub2) => {
                        if (errSub) {
                          if (errSub.code === "ER_DUP_ENTRY") {
                            console.log("HERE SUB 150 SECOND", errSub);
                            req.flash("success", "Registered For this Event");
                            // req.flash(
                            //   "error",
                            //   "Already Registered For this Event"
                            // );
                            return res.redirect("register");
                          } else if (errSub.code === "ER_NO_REFERENCED_ROW_2") {
                            req.flash("error", "Event or User Not found!");
                            logger.log(
                              "error",
                              `Register Event POST Error ${errSub}`
                            );
                            return res.redirect("register");
                          } else {
                            req.flash("error", "Oops something went wrong !");
                            logger.log(
                              "error",
                              `Register Event POST Error ${errSub}`
                            );
                            return res.redirect("register");
                          }
                        } else {
                          req.flash(
                            "success",
                            `register for the Event ${req.body.eventId}`
                          );
                          logger.log(
                            "success",
                            `User Registed For a new Event ${req.body.eventId} by user ${dataSub[0].userId}`
                          );
                          return res.redirect("register");
                        }
                      }
                    );
                  } else if (dataSub[0].paid == 250) {
                    sql = `INSERT INTO attendees (eventid, userid) VALUES (? ,?)`;
                    connection.query(
                      sql,
                      [req.body.eventId, dataSub[0].userId],
                      (errSub, dataSub) => {
                        if (errSub) {
                          if (errSub.code === "ER_DUP_ENTRY") {
                            console.log("HERE SUB 250", errSub);
                            req.flash("success", "Registered For this Event");
                            // req.flash(
                            //   "error",
                            //   "Already Registered For this Event"
                            // );
                            return res.redirect("register");
                          } else if (errSub.code === "ER_NO_REFERENCED_ROW_2") {
                            req.flash("error", "Event or User Not found!");
                            logger.log(
                              "error",
                              `Register Event POST Error ${errSub}`
                            );
                            return res.redirect("register");
                          } else {
                            req.flash("error", "Oops something went wrong !");
                            logger.log(
                              "error",
                              `Register Event POST Error ${errSub}`
                            );
                            return res.redirect("register");
                          }
                        } else {
                          req.flash(
                            "success",
                            `register for the Event ${req.body.eventId}`
                          );
                          logger.log(
                            "success",
                            `User Registed For a new Event ${req.body.eventId} by user ${data[0].userId}`
                          );
                          return res.redirect("register");
                        }
                      }
                    );
                  } else {
                    req.flash(
                      "error",
                      "Please Pay to Register for the events !"
                    );
                    return res.redirect("/pay");
                  }
                } else {
                  req.flash("error", "Oops something went wrong !");
                  logger.log(
                    "error",
                    `Register Event DATA type is null Error Line 183 ${JSON.stringify(
                      dataType
                    )}`
                  );
                  return res.redirect("register");
                }
              }
            });
          }
        });
      } else {
        sql = "SELECT type from events where id =?";
        console.log("HERE EVENTS MORE ");
        connection.query(sql, [req.body.eventId], (errType, dataType) => {
          if (errType) {
            if (errSub.code === "ER_NO_REFERENCED_ROW_2") {
              req.flash("error", "Event Not found! Please Refresh");
              logger.log(
                "error",
                `Register Event POST errSub Error ${errType}`
              );
              return res.redirect("register");
            } else {
              req.flash("error", "Oops something went wrong !");
              logger.log("error", `Register Event POST Error ${errType}`);
              return res.redirect("register");
            }
          }
          console.log("DATA TYEPPP HERE : ", dataType);
          dataType = dataType[0];
          console.log("DATA TYEPPP HERE NEXT : ", dataType);
          if (dataType.type) {
            if (data[0].paid == 100) {
              if (dataType.type == "Non Technical") {
                // if (data[0].registeredEventCount < 3) {
                //code for non techincal event register
                sql = `INSERT INTO attendees (eventid, userid) VALUES (? ,?)`;
                connection.query(
                  sql,
                  [req.body.eventId, data[0].userId],
                  (errSub, dataSub) => {
                    if (errSub) {
                      if (errSub.code === "ER_DUP_ENTRY") {
                        console.log("HERE SUB 100 SECOND", errSub);
                        req.flash("success", "Registered For this Event");
                        // req.flash("error", "Already Registered For this Event");
                        return res.redirect("register");
                      } else if (errSub.code === "ER_NO_REFERENCED_ROW_2") {
                        req.flash("error", "Event or User Not found!");
                        logger.log(
                          "error",
                          `Register Event POST Error ${errSub}`
                        );
                        return res.redirect("register");
                      } else {
                        req.flash("error", "Oops something went wrong !");
                        logger.log(
                          "error",
                          `Register Event POST Error ${errSub}`
                        );
                        return res.redirect("register");
                      }
                    } else {
                      req.flash(
                        "success",
                        `register for the Event ${req.body.eventId}`
                      );
                      logger.log(
                        "success",
                        `User Registed For a new Event ${req.body.eventId} by user ${data[0].userId}`
                      );
                      return res.redirect("register");
                    }
                  }
                );
              } else {
                req.flash(
                  "error",
                  `Oops!, This is a Technical Event! Pay ₹150 to register for Technical Events!`
                );
                return res.redirect("register");
              }
            } else if (data[0].paid == 150) {
              //code for techincal event register
              if (dataType.type == "Technical") {
                sql = `INSERT INTO attendees (eventid, userid) VALUES (? ,?)`;
                connection.query(
                  sql,
                  [req.body.eventId, data[0].userId],
                  (errSub, dataSub) => {
                    if (errSub) {
                      if (errSub.code === "ER_DUP_ENTRY") {
                        console.log("HERE SUB 150 THIRD", errSub);
                        req.flash("success", "Registered For this Event");
                        // req.flash("error", "Already Registered For this Event");
                        return res.redirect("register");
                      } else if (errSub.code === "ER_NO_REFERENCED_ROW_2") {
                        req.flash("error", "Event or User Not found!");
                        logger.log(
                          "error",
                          `Register Event POST Error ${errSub}`
                        );
                        return res.redirect("register");
                      } else {
                        req.flash("error", "Oops something went wrong !");
                        logger.log(
                          "error",
                          `Register Event POST Error ${errSub}`
                        );
                        return res.redirect("register");
                      }
                    } else {
                      sql = `INSERT INTO attendees (eventid, userid) VALUES (? ,?)`;
                      connection.query(
                        sql,
                        [req.body.eventId, data[0].userId],
                        (errSub, dataSub) => {
                          if (errSub) {
                            if (errSub.code === "ER_DUP_ENTRY") {
                              console.log("HERE SUB THERLA", errSub);
                              req.flash("success", "Registered For this Event");
                              // req.flash(
                              //   "error",
                              //   "Already Registered For this Event"
                              // );
                              return res.redirect("register");
                            } else if (
                              errSub.code === "ER_NO_REFERENCED_ROW_2"
                            ) {
                              req.flash("error", "Event or User Not found!");
                              logger.log(
                                "error",
                                `Register Event POST Error ${errSub}`
                              );
                              return res.redirect("register");
                            } else {
                              req.flash("error", "Oops something went wrong !");
                              logger.log(
                                "error",
                                `Register Event POST Error ${errSub}`
                              );
                              return res.redirect("register");
                            }
                          } else {
                            req.flash(
                              "success",
                              `register for the Event ${req.body.eventId}`
                            );
                            logger.log(
                              "success",
                              `User Registed For a new Event ${req.body.eventId} by user ${data[0].userId}`
                            );
                            return res.redirect("register");
                          }
                        }
                      );
                    }
                  }
                );
              } else {
                req.flash(
                  "error",
                  `Oops!, This is a Non Technical Event! Pay ₹100 to register for Non Technical Events!`
                );
                return res.redirect("register");
              }
            } else if (data[0].paid == 250) {
              sql = `INSERT INTO attendees (eventid, userid) VALUES (? ,?)`;
              connection.query(
                sql,
                [req.body.eventId, data[0].userId],
                (errSub, dataSub) => {
                  if (errSub) {
                    if (errSub.code === "ER_DUP_ENTRY") {
                      console.log("HERE SUB 250 BLOCK HERE", errSub);
                      req.flash("success", "Registered For this Event");
                      // req.flash("error", "Already Registered For this Event");
                      return res.redirect("register");
                    } else if (errSub.code === "ER_NO_REFERENCED_ROW_2") {
                      req.flash("error", "Event or User Not found!");
                      logger.log(
                        "error",
                        `Register Event POST Error ${errSub}`
                      );
                      return res.redirect("register");
                    } else {
                      req.flash("error", "Oops something went wrong !");
                      logger.log(
                        "error",
                        `Register Event POST Error ${errSub}`
                      );
                      return res.redirect("register");
                    }
                  } else {
                    req.flash(
                      "success",
                      `register for the Event ${req.body.eventId}`
                    );
                    logger.log(
                      "success",
                      `User Registed For a new Event ${req.body.eventId} by user ${data[0].userId}`
                    );
                    return res.redirect("register");
                  }
                }
              );
            } else {
              req.flash("error", "Please Pay to Register for the events !");
              return res.redirect("/pay");
            }
          } else {
            req.flash("error", "Oops something went wrong !");
            logger.log(
              "error",
              `Register Event DATA type is null Error Line 183 ${JSON.stringify(
                dataType
              )}`
            );
            return res.redirect("register");
          }
        });
      }
    }
  });
});

module.exports = router;
