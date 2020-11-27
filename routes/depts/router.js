var express = require("express");
var router = express.Router();
var cseDeptRouter = require("./cse");
var itDeptRouter = require("./it");
var eceDeptRouter = require("./ece");
var civilDeptRouter = require("./civil");
var eeeDeptRouter = require("./eee");
var bmeDeptRouter = require("./bme");
var mechDeptRouter = require("./mech");
var chemDeptRouter = require("./chem");

router.use("/cse", cseDeptRouter);
router.use("/it", itDeptRouter);
router.use("/ece", eceDeptRouter);
router.use("/civil", civilDeptRouter);
router.use("/eee", eeeDeptRouter);
router.use("/bme", bmeDeptRouter);
router.use("/mech", mechDeptRouter);
router.use("/chem", chemDeptRouter);

module.exports = router;
