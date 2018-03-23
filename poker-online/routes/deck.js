"use strict";
var Card = require("./card");
var Deck = (function () {
    function Deck() {
        this.cards = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 13; j++) {
                var card = new Card(i + 1, j + 1);
                this.cards.push(card);
            }
        }
    }
    Deck.prototype.getCards = function () {
        return this.cards;
    };
    Deck.prototype.draw = function (num) {
        var res = [];
        for (var i = 0; i < num; i++) {
            res.push(this.cards.pop());
        }
        return res;
    };
    Deck.prototype.shuffle = function () {
        //Fisher-Yates Shuffle
        var m = this.cards.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = this.cards[m];
            this.cards[m] = this.cards[i];
            this.cards[i] = t;
        }
    };
    return Deck;
}());
module.exports = Deck;
