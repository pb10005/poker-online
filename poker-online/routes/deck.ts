import Card = require('./card');
class Deck {
    private cards: Array<Card>
    constructor() {
        this.cards = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 13; j++) {
                let card = new Card(i + 1, j+1);
                this.cards.push(card);
            }
        }
    }
    getCards(): Array<Card> {
        return this.cards;
    }
    draw(num: number): Array<Card> {
        let res = [];
        for (var i = 0; i < num; i++) {
            res.push(this.cards.pop());
        }
        return res;
    }
    shuffle(): void{
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
export = Deck;