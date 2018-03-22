"use strict";
const Card = require("./card");
class Deck {
    constructor() {
        this.cards = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 13; j++) {
                let card = new Card(i + 1, j + 1);
                this.cards.push(card);
            }
        }
    }
    getCards() {
        return this.cards;
    }
    draw(num) {
        let res = [];
        for (var i = 0; i < num; i++) {
            res.push(this.cards.pop());
        }
        return res;
    }
    shuffle() {
        //Fisher-Yates Shuffle
        let m = this.cards.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = this.cards[m];
            this.cards[m] = this.cards[i];
            this.cards[i] = t;
        }
    }
}
module.exports = Deck;
//# sourceMappingURL=deck.js.map