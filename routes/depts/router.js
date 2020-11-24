var express = require("express");
var router = express.Router();
var eceRouter = require("./ece");

router.use("/ece", eceRouter);

module.exports = router;
