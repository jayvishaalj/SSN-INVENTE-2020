var express = require("express");
const connection = require("../middleware/db");
var router = express.Router();
const https = require("https");
const qs = require("querystring");
const Paytm = require("paytmchecksum");
const config = require("./Paytm/config");
const checksum_lib = require("./Paytm/checksum");
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

router.get("/update", function (req, res, next) {
  const messages = req.flash();
  if (req.session.isLogged) {
    if (req.session.data) {
      console.log(req.session.payment);
      return res.render("update", {
        messages,
      });
    } else {
      return res.redirect("/auth/login");
    }
  } else {
    return res.redirect("/auth/login");
  }
});

router.get("/failure", (req, res) => {
  req.flash("error", "Payment Failed! If debited will be refunded!");
  return res.redirect("/pay");
});

/* Payment POST API  */

router.post("/paynow", (req, res) => {
  try {
    if (req.session.data && req.session.data.email && req.session.isLogged) {
      logger.log(
        "info",
        `User Initiated a PAYMENT ${req.session.data.email}, ${req.body.amount} `
      );
      if (req.body.amount === "100" || req.body.amount === "200") {
        let sql = "SELECT id as userId, paid, phone from users where email = ?";
        connection.query(sql, [req.session.data.email], (err, data) => {
          if (err) {
            req.flash(
              "error",
              "Oh Snap! Something Happened Please Try Again after sometime!"
            );
            logger.log(
              "error",
              `User PAY PAYTM PAID GETTING DB Error ${JSON.stringify(
                req.body
              )}, Error : ${error}`
            );
            return res.redirect("/event/register");
          } else {
            data = data[0];
            console.log("DATA FROM DB : ", data);
            var paymentDetails = {
              amount: req.body.amount,
              customerId: "CUST_" + data.userId,
              customerEmail: req.session.data.email,
              customerPhone: data.phone + "",
            };

            if (data.paid === 0) {
              //allow to pay any amount of the req body
              console.log(
                "ENTERED 0 DATA FLOW : ",
                config,
                " PD : ",
                paymentDetails
              );
              var params = {};
              params["MID"] = config.PaytmConfig.mid;
              params["WEBSITE"] = config.PaytmConfig.website;
              params["CHANNEL_ID"] = "WEB";
              params["INDUSTRY_TYPE_ID"] = "Retail";
              params["ORDER_ID"] = "TEST_" + new Date().getTime();
              params["CUST_ID"] = paymentDetails.customerId;
              params["TXN_AMOUNT"] = paymentDetails.amount;
              params["CALLBACK_URL"] = "https://jayvishaalj.cf/callback/paytm";
              params["EMAIL"] = paymentDetails.customerEmail;
              params["MOBILE_NO"] = paymentDetails.customerPhone;

              var paytmChecksum = Paytm.generateSignature(
                params,
                config.PaytmConfig.key
              );
              paytmChecksum
                .then(function (checksum) {
                  console.log("generateSignature Returns: " + checksum);
                  var txn_url =
                    "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
                  // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
                  console.log("SESSION : ", req.session.data);
                  const messages = req.flash();
                  req.session.payment = params;
                  return res.render("payment", {
                    messages,
                    params,
                    txn_url,
                    checksum,
                  });
                })
                .catch(function (error) {
                  console.log(error);
                  req.flash(
                    "error",
                    "Oh Snap! Something Happened Please Try Again after sometime!"
                  );
                  logger.log(
                    "error",
                    `User PAY PAYTM API GENCHECKSUM Error REPORT ${JSON.stringify(
                      req.body
                    )}, Error : ${error}`
                  );
                  return res.redirect("/user/home");
                });
            } else if (data.paid === 100) {
              //allow to pay only 100 more amount
              console.log(
                "ENTERED 0 DATA FLOW : ",
                config,
                " PD : ",
                paymentDetails
              );
              var params = {};
              params["MID"] = config.PaytmConfig.mid;
              params["WEBSITE"] = config.PaytmConfig.website;
              params["CHANNEL_ID"] = "WEB";
              params["INDUSTRY_TYPE_ID"] = "Retail";
              params["ORDER_ID"] = "TEST_" + new Date().getTime();
              params["CUST_ID"] = paymentDetails.customerId;
              params["TXN_AMOUNT"] = 100 + "";
              params["CALLBACK_URL"] = "https://jayvishaalj.cf/callback/paytm";
              params["EMAIL"] = paymentDetails.customerEmail;
              params["MOBILE_NO"] = paymentDetails.customerPhone;

              var paytmChecksum = Paytm.generateSignature(
                params,
                config.PaytmConfig.key
              );
              paytmChecksum
                .then(function (checksum) {
                  console.log("generateSignature Returns: " + checksum);
                  var txn_url =
                    "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
                  // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
                  console.log("SESSION : ", req.session.data);
                  const messages = req.flash();
                  req.session.payment = params;
                  return res.render("payment", {
                    messages,
                    params,
                    txn_url,
                    checksum,
                  });
                })
                .catch(function (error) {
                  console.log(error);
                  req.flash(
                    "error",
                    "Oh Snap! Something Happened Please Try Again after sometime!"
                  );
                  logger.log(
                    "error",
                    `User PAY PAYTM API GENCHECKSUM Error REPORT ${JSON.stringify(
                      req.body
                    )}, Error : ${error}`
                  );
                  return res.redirect("/user/home");
                });
            } else {
              // dont allow to pay anything
              req.flash("error", "You have Already paid the MAX amount!");
              logger.log("error", `User Repayment 200 Payment Error`);
              return res.redirect("/event/register");
            }
          }
        });
      } else {
        logger.log(
          "error",
          `User Changed  a PAYMENT AMOUNT REPORT ${req.session.data.email}, ${req.body.amount} `
        );
        req.flash("error", "Please Select a Valid Payment Option From Below!");
        return res.redirect("/event/register");
      }
    } else {
      req.flash(
        "error",
        "Oh Snap! You need to be logged In to Initiate Payment!"
      );
      logger.log(
        "error",
        `User PAY NOT LOGGEDIN Error ${JSON.stringify(
          req.body
        )}, Error : ${error}`
      );
      return res.redirect("/auth/login");
    }
  } catch (error) {
    req.flash(
      "error",
      "Oh Snap! Something Happened Please Try Again after sometime!"
    );
    logger.log(
      "error",
      `User PAY PAYTM Catch Block Error ${JSON.stringify(
        req.body
      )}, Error : ${error}`
    );
    return res.redirect("/event/register");
  }
});

router.post("/paytm", (req, res) => {
  // Route for verifiying payment
  console.log("ENTERED CALLBACK URL");
  var body = "";

  req.on("data", function (data) {
    body += data;
    console.log("DATA");
  });
  req.on("end", function () {
    console.log("REQ END");
    var html = "";
    var post_data = qs.parse(body);

    // received params in callback
    console.log("Callback Response: ", post_data, "\n");

    let paytmChecksum = post_data.CHECKSUMHASH;
    console.log("CHECKSUM : ", paytmChecksum);
    var result = checksum_lib.verifychecksum(
      post_data,
      config.PaytmConfig.key,
      paytmChecksum
    );
    console.log("Checksum Result => ", result, "\n");

    if (result) {
      // Send Server-to-Server request to verify Order Status
      var params = { MID: config.PaytmConfig.mid, ORDERID: post_data.ORDERID };

      checksum_lib.genchecksum(
        params,
        config.PaytmConfig.key,
        function (err, checksum) {
          params.CHECKSUMHASH = checksum;
          post_data = "JsonData=" + JSON.stringify(params);

          var options = {
            hostname: "securegw-stage.paytm.in", // for staging
            // hostname: 'securegw.paytm.in', // for production
            port: 443,
            path: "/merchant-status/getTxnStatus",
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Content-Length": post_data.length,
            },
          };

          // Set up the request
          var response = "";
          var post_req = https.request(options, function (post_res) {
            post_res.on("data", function (chunk) {
              response += chunk;
            });

            post_res.on("end", function () {
              console.log("S2S Response: ", response, "\n");

              var _result = JSON.parse(response);
              if (_result.STATUS == "TXN_SUCCESS") {
                req.session.payment = {
                  status: true,
                  amount: response.TXNAMOUNT,
                  response,
                };
                console.log("REDIRECT INITIATED", req.session);
                logger.log(
                  "info",
                  `User made a PAYMENT ${JSON.stringify(response)}`
                );
                return res.redirect("/pay/update");
              } else {
                console.log("REDIRECT INITIATED", req.session.data);
                logger.log(
                  "error",
                  `User error in a PAYMENT ${JSON.stringify(response)}`
                );
                return res.redirect("/pay/failure");
              }
            });
          });

          // post the data
          post_req.write(post_data);
          post_req.end();
        }
      );
    } else {
      logger.log(
        "error",
        `MISMATCHED CHECKSUM PAYTM REPORT ${req.session.data}`
      );
    }
  });
});

router.post("/update", (req, res) => {
  try {
    let sql = `UPDATE users SET paid = paid + ? where email = ?`;
    console.log("UPDATE CALLBACK : ", req.session);
    if (req.session.payment && req.session.data && req.session.data.email) {
      console.log("SESSION STATUS PAYMENT : ", req.session);
      console.log("SUCCESS SESSION GOT ", req.session);
      let _result = JSON.parse(req.session.payment.response);
      console.log("RESULT : ", _result);
      console.log("RESULT PAID : ", _result.TXNAMOUNT);
      connection.query(
        sql,
        [_result.TXNAMOUNT, req.session.data.email],
        (err, data) => {
          if (err) {
            console.log("ERRORRR : ", err);
            req.flash(
              "error",
              "Oh Snap! Pls Contact Our POC on this transaction if money was taken from your ACC!"
            );
            logger.log("error", `User Payment DB WRITEUP Error ${err}`);
            return res.redirect("/user/home");
          } else {
            req.flash("success", "Payment Successfull");
            logger.log(
              "info",
              `User made a PAYMENT ${req.session.data.email}, ${JSON.stringify(
                req.session.payment
              )}`
            );
            return res.redirect("/event/register");
          }
        }
      );
    } else {
      req.flash(
        "error",
        "Oh Snap! Pls Contact Our POC on this transaction if money was taken from your ACC!"
      );
      logger.log(
        "error",
        `User PAYTM SUCCESS DB UPDATE Catch Block Error : ${error}`
      );
      return res.redirect("/user/home");
    }
  } catch (error) {
    req.flash(
      "error",
      "Oh Snap! Pls Contact Our POC on this transaction if money was taken from your ACC!"
    );
    logger.log(
      "error",
      `User PAYTM SUCCESS DB UPDATE Catch Block Error : ${error}`
    );
    return res.redirect("/user/home");
  }
});

// router.post("/", (req, res) => {
//   logger.log(
//     "info",
//     `User Initiated a PAYMENT ${req.session.data.email}, ${req.body.amount} `
//   );
//   if (req.session.data.paid === 200) {
//     req.flash("error", "You have Already paid the MAX amount!");
//     logger.log("error", `User Repayment 200 Payment Error`);
//     return res.redirect("/user/home");
//   } else {
//     if (req.session.data.paid === 100) {
//       let sql = `UPDATE users SET paid = 200 where email = ?`;
//       connection.query(sql, [req.session.data.email], (err, data) => {
//         if (err) {
//           req.flash(
//             "error",
//             "Oops something went wrong Coudln't Initiate Payment!"
//           );
//           logger.log("error", `User Payment API Error ${err}`);
//           return res.redirect("/pay");
//         } else {
//           req.flash("success", `You Have Sucessfully Paid ₹100`);
//           logger.log(
//             "info",
//             `User made a PAYMENT ${req.session.data.email}, 100`
//           );
//           return res.redirect("/user/home");
//         }
//       });
//     } else {
//       let sql = `UPDATE users SET paid = ? where email = ?`;
//       connection.query(
//         sql,
//         [req.body.amount, req.session.data.email],
//         (err, data) => {
//           if (err) {
//             req.flash(
//               "error",
//               "Oops something went wrong Coudln't Initiate Payment!"
//             );
//             logger.log("error", `User Payment API Error ${err}`);
//             return res.redirect("/pay");
//           } else {
//             req.flash(
//               "success",
//               `You Have Sucessfully Paid ₹${req.body.amount}`
//             );
//             logger.log(
//               "info",
//               `User made a PAYMENT ${req.session.data.email}, ${req.body.amount}`
//             );
//             return res.redirect("/event/register");
//           }
//         }
//       );
//     }
//   }
// });

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
