var express = require("express");
var router = express.Router();
var userAuth = require("./auth");
var superUserAuth = require("./superUserAuth");
var headUserAuth = require("./eventHeadAuth");

router.use("/head", headUserAuth);
router.use("/super", superUserAuth);
router.use("/", userAuth);

module.exports = router;
