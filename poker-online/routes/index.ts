/*
 * GET home page.
 */
import express = require('express');
const router = express.Router();
import Deck = require("./deck");
import Hand = require('./hand');
import Card = require('./card');
import Game = require('./game');
router.get('/', (req: express.Request, res: express.Response, next) => {
    res.render('index', { title: 'Poker' });
});

export default router;