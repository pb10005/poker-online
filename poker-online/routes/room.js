"use strict";
exports.__esModule = true;
var express = require("express");
var router = express.Router();
router.get('/:id', function (req, res) {
    res.render("room", { room: req.params.id });
});
exports["default"] = router;
