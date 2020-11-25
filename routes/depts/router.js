var express = require("express");
var router = express.Router();
var eceDeptRouter = require("./ece");

router.use("/ece", eceDeptRouter);

module.exports = router;
