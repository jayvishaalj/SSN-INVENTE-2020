var express = require("express");
var router = express.Router();
var homeRouter = require("./home");

router.use("/home", homeRouter);

module.exports = router;
