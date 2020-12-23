var express = require("express");
var router = express.Router();
var homeRouter = require("./home");
var updateRouter = require("./update");
var userDetailsRouter = require("./userDetails");

router.use("/home", homeRouter);
router.use("/update", updateRouter);
router.use("/user", userDetailsRouter);

module.exports = router;
