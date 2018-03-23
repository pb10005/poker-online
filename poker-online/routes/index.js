"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET home page.
 */
var express = require("express");
var router = express.Router();
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Poker' });
});
exports.default = router;
//# sourceMappingURL=index.js.map