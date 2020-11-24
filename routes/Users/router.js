var express = require("express");
var router = express.Router();
var homeRouter = require("./home");
var profileRouter = require("./profile");

router.use("/home", homeRouter);
router.use("/profile", profileRouter);

module.exports = router;
