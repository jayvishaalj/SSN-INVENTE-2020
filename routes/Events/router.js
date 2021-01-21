var express = require("express");
var router = express.Router();
var registerRouter = require("./register_event_closed");
var headRouter = require("./head_home");

router.use("/head", headRouter);
router.use("/register", registerRouter);

module.exports = router;
