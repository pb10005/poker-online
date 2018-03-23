"use strict";
exports.__esModule = true;
/*
 * GET users listing.
 */
var express = require("express");
var router = express.Router();
router.get('/', function (req, res) {
    res.send("respond with a resource");
});
exports["default"] = router;
