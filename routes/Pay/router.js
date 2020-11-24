var express = require("express");
var router = express.Router();
var payRouter = require("./pay");

router.use("/", payRouter);

module.exports = router;
