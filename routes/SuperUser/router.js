var express = require("express");
var router = express.Router();
var homeRouter = require("./home");
var updateRouter = require("./update");

router.use("/home", homeRouter);
router.use("/update", updateRouter);

module.exports = router;
