"use strict";
exports.__esModule = true;
/*
 * GET home page.
 */
var express = require("express");
var router = express.Router();
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Poker' });
});
exports["default"] = router;
