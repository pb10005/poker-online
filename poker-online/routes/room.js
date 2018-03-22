"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get('/:id', (req, res) => {
    res.render("room", { room: req.params.id });
});
exports.default = router;
//# sourceMappingURL=room.js.map