var express = require("express");
var router = express.Router();
var indexRouter = require("./index");
var usersRouter = require("./Users/router");
var authRouter = require("./Auth/router");
var deptRouter = require("./depts/router");
var eventRouter = require("./Events/router");
var paymentRouter = require("./Pay/router");
var superUserRouter = require("./SuperUser/router");

router.use("/user", usersRouter);
router.use("/super", superUserRouter);
router.use("/auth", authRouter);
router.use("/dept", deptRouter);
router.use("/event", eventRouter);
router.use("/pay", paymentRouter);
router.use("/", indexRouter);

module.exports = router;
