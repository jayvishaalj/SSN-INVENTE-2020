var express = require("express");
var router = express.Router();
var cseDeptRouter = require("./cse");
var itDeptRouter = require("./it");
var eceDeptRouter = require("./ece");
var civilDeptRouter = require("./civil");
var eeeDeptRouter = require("./eee");

router.use("/cse", cseDeptRouter);
router.use("/it", itDeptRouter);
router.use("/ece", eceDeptRouter);
router.use("/civil", civilDeptRouter);
router.use("/eee", eeeDeptRouter);

module.exports = router;
