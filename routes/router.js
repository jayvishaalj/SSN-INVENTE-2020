var express = require("express");
var router = express.Router();
var indexRouter = require("./index");
var usersRouter = require("./Users/router");
var authRouter = require("./Auth/auth");

router.use("/", indexRouter);
router.use("/user", usersRouter);
router.use("/auth", authRouter);

module.exports = router;
