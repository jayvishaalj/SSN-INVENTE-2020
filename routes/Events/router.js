var express = require("express");
var router = express.Router();
var registerRouter = require("./register_event_type");

router.use("/register", registerRouter);

module.exports = router;
