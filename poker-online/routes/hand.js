"use strict";
var Hand = (function () {
    function Hand(c1, c2, c3, c4, c5) {
        this.c1 = c1;
        this.c2 = c2;
        this.c3 = c3;
        this.c4 = c4;
        this.c5 = c5;
        this.rank = this.judge();
    }
    Hand.prototype.getRank = function () {
        return this.rank;
    };
    Hand.prototype.getCards = function () {
        return [this.c1, this.c2, this.c3, this.c4, this.c5];
    };
    Hand.prototype.show = function () {
        return this.getCards().map(function (x) { return x.show(); }).join(' ');
    };
    Hand.prototype.judge = function () {
        //役を判定する
        var suits = this.countSuit();
        var nums = this.countNum();
        var straightCount = 0, strength;
        for (var i = 0; i < 13; i++) {
            if (nums[i] == 4) {
                return {
                    strength: i,
                    rank: 7,
                    name: 'four of a kind'
                };
            }
            else if (nums[i] == 3) {
                for (var j = i + 1; j < 13; j++) {
                    if (nums[j] == 2) {
                        return {
                            strength: i,
                            rank: 6,
                            name: 'full house'
                        };
                    }
                }
                return {
                    strength: i,
                    rank: 3,
                    name: 'three of a kind'
                };
            }
            else if (nums[i] == 2) {
                for (var j = i + 1; j < 13; j++) {
                    if (nums[j] == 3) {
                        return {
                            strength: j,
                            rank: 6,
                            name: 'full house'
                        };
                    }
                    else if (nums[j] == 2) {
                        return {
                            strength: j,
                            rank: 2,
                            name: 'two pair'
                        };
                    }
                }
                return {
                    strength: i,
                    rank: 1,
                    name: 'pair'
                };
            }
            else if (nums[i] == 1) {
                straightCount++;
                strength = i;
                if (straightCount == 5) {
                    if (Math.max.apply(null, suits) == 5) {
                        return {
                            strength: i,
                            rank: 8,
                            name: 'straight flush'
                        };
                    }
                    else {
                        return {
                            strength: i,
                            rank: 4,
                            name: 'straight'
                        };
                    }
                }
            }
            else {
                straightCount = 0;
            }
        }
        if (Math.max.apply(null, suits) == 5) {
            return {
                strength: strength,
                rank: 5,
                name: 'flush'
            };
        }
        else {
            return {
                strength: strength,
                rank: 0,
                name: 'no hand'
            };
        }
    };
    Hand.prototype.countNum = function () {
        var res = new Array(13);
        for (var i = 0; i < 13; i++) {
            res[i] = 0;
        }
        res[this.c1.getNum() - 1]++;
        res[this.c2.getNum() - 1]++;
        res[this.c3.getNum() - 1]++;
        res[this.c4.getNum() - 1]++;
        res[this.c5.getNum() - 1]++;
        return res;
    };
    Hand.prototype.countSuit = function () {
        var res = new Array(4);
        for (var i = 0; i < 4; i++) {
            res[i] = 0;
        }
        res[this.c1.getSuit() - 1]++;
        res[this.c2.getSuit() - 1]++;
        res[this.c3.getSuit() - 1]++;
        res[this.c4.getSuit() - 1]++;
        res[this.c5.getSuit() - 1]++;
        return res;
    };
    return Hand;
}());
module.exports = Hand;
//# sourceMappingURL=hand.js.map