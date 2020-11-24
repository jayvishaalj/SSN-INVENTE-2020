var express = require("express");
var router = express.Router();
var indexRouter = require("./index");
var usersRouter = require("./Users/router");
var authRouter = require("./Auth/auth");
var deptRouter = require("./Depts/router");
var eventRouter = require("./Events/router");
var paymentRouter = require("./Pay/router");

router.use("/", indexRouter);
router.use("/user", usersRouter);
router.use("/auth", authRouter);
router.use("/dept", deptRouter);
router.use("/event", eventRouter);
router.use("/pay", paymentRouter);

module.exports = router;
