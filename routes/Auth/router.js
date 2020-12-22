var express = require("express");
var router = express.Router();
var userAuth = require("./auth");
var superUserAuth = require("./superUserAuth");

router.use("/super", superUserAuth);
router.use("/", userAuth);

module.exports = router;
