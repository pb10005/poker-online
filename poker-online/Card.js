"use strict";
var Card = (function () {
    function Card(suit, num) {
        //1:スペード 2:ハート 3:クラブ 4:ダイヤ
        this.suit = suit;
        this.num = num;
        if (num == 1)
            this.strength = 14;
        else
            this.strength = num;
    }
    Card.prototype.show = function () {
        var res = "";
        switch (this.suit) {
            case 1:
                res += "S";
                break;
            case 2:
                res += "H";
                break;
            case 3:
                res += "C";
                break;
            case 4:
                res += "D";
                break;
            default:
                res += "-";
                break;
        }
        switch (this.num) {
            case 1:
                res += "A";
                break;
            case 11:
                res += "J";
                break;
            case 12:
                res += "Q";
                break;
            case 13:
                res += "K";
                break;
            default:
                res += this.num;
                break;
        }
        return res;
    };
    return Card;
}());
module.exports = Card;
//# sourceMappingURL=Card.js.map