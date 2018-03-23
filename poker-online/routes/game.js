"use strict";
var async = require("async");
var Deck = require("./deck");
var Hand = require("./hand");
var Roster = require("./roster");
var Game = (function () {
    function Game(name, limit) {
        this.playerLimit = limit;
        this.deck = new Deck();
        this.roster = new Roster();
        this.community = [];
        this.ended = false;
        this.started = false;
        this.roomName = name;
        this.messages = [];
    }
    Game.prototype.initialize = function () {
        this.deck.shuffle();
    };
    Game.prototype.enter = function (player) {
        var exist = false;
        //IPアドレスが同じsocketがあれば、playerを引き継ぐ
        for (var i = 0; i < this.roster.players.length; i++) {
            console.log("current", this.roster.players[i].address);
            console.log("newaddr", player.getSocket().handshake.address);
            if (this.roster.players[i].address === player.getSocket().handshake.address) {
                this.roster.players[i].succeed(player);
                this.notifyCurrent(this.roster.players[i]);
                exist = true;
            }
        }
        if (!exist && this.roster.players.length < this.playerLimit) {
            //Playerを新たに追加する
            player.name = "Guest" + this.roster.players.length.toString();
            this.roster.add(player);
            var num = this.roster.players.length;
            var socket = player.getSocket();
            player.sendMsg("name", player.name);
            player.sendMsg("player", num);
            player.broadcast("player", num);
            player.broadcast("join", player.getSocket().name + " joined!");
            //人数が揃ったらカードを配る
            if (!this.started && this.roster.players.length == this.playerLimit) {
                this.distribute();
                this.started = true;
            }
        }
    };
    Game.prototype.quit = function (player) {
        this.roster.remove(player);
    };
    Game.prototype.distribute = function () {
        //人数が揃っていない場合をはじく
        if (this.roster.players.length < 2)
            return;
        //カードを配る
        this.community = this.deck.draw(5);
        for (var i = 0; i < 3; i++) {
            this.community[i].isOpen = true;
        }
        for (var player in this.roster.players) {
            this.notifyOpen();
            this.roster.players[player].setHole(this.deck.draw(2));
        }
    };
    Game.prototype.openNext = function () {
        //Communityをめくる
        if (!this.community[3])
            return;
        if (!this.community[3].isOpen) {
            this.community[3].isOpen = true;
            this.notifyOpen();
        }
        else if (!this.community[4].isOpen) {
            this.community[4].isOpen = true;
            this.notifyOpen();
            this.ended = true;
        }
        else {
        }
    };
    Game.prototype.notifyCurrent = function (player) {
        //状態を通知する
        player.sendMsg("name", player.name);
        var num = this.roster.players.length;
        player.sendMsg("player", num);
        var hole = player.getHole();
        if (hole.length != 0) {
            player.sendMsg("hole", hole);
        }
        if (this.community.length != 0) {
            player.sendMsg("community", this.community.filter(function (x) { return x.isOpen; }));
        }
        if (this.community.filter(function (x) { return x.isOpen; }).length == 5) {
            player.sendMsg("hand", player.getBestHand().getRank());
        }
    };
    Game.prototype.notifyOpen = function () {
        //Notify that a community card has been revealed.
        for (var player in this.roster.players) {
            this.roster.players[player].sendMsg("community", this.community.filter(function (x) { return x.isOpen; }));
        }
    };
    Game.prototype.judgeHand = function () {
        //始まっていない場合をはじく
        if (!this.started)
            return;
        //HoleとCommunityをあわせた最強の役を見つける
        for (var player in this.roster.players) {
            var hole = this.roster.players[player].getHole();
            var hands = [
                //Communityの組み合わせ10通り
                new Hand(hole[0], hole[1], this.community[0], this.community[1], this.community[2]),
                new Hand(hole[0], hole[1], this.community[0], this.community[1], this.community[3]),
                new Hand(hole[0], hole[1], this.community[0], this.community[1], this.community[4]),
                new Hand(hole[0], hole[1], this.community[0], this.community[2], this.community[3]),
                new Hand(hole[0], hole[1], this.community[0], this.community[2], this.community[4]),
                new Hand(hole[0], hole[1], this.community[0], this.community[3], this.community[4]),
                new Hand(hole[0], hole[1], this.community[1], this.community[2], this.community[3]),
                new Hand(hole[0], hole[1], this.community[1], this.community[2], this.community[4]),
                new Hand(hole[0], hole[1], this.community[1], this.community[3], this.community[4]),
                new Hand(hole[0], hole[1], this.community[2], this.community[3], this.community[4])
            ];
            var bestHand = hands[0], bestRank = hands[0].getRank().rank;
            for (var i = 1; i < 10; i++) {
                var rank = hands[i].getRank().rank;
                if (rank > bestRank) {
                    bestHand = hands[i];
                    bestRank = rank;
                }
            }
            this.roster.players[player].setBestHand(bestHand);
        }
    };
    Game.prototype.judgeWinner = function () {
        var _this = this;
        //始まっていない場合をはじく
        if (!this.started)
            return;
        async.map(this.roster.players, function (player, callback) {
            callback(null, player.getBestHand());
        }, function (err, hands) {
            var isDraw = true;
            var bestIndex = 0;
            var best = hands[0].getRank();
            for (var i = 1; i < hands.length; i++) {
                if (hands[i].getRank().rank > best.rank) {
                    bestIndex = i;
                    best = hands[i].getRank();
                    isDraw = false;
                }
                else if (hands[i].getRank().rank == best.rank) {
                    if (hands[i].getRank().strength > best.strength) {
                        bestIndex = i;
                        best = hands[i].getRank();
                        isDraw = false;
                    }
                    else if (hands[i].getRank().strength < best.strength) {
                        isDraw = false;
                    }
                }
                else {
                    isDraw = false;
                }
            }
            var data;
            if (isDraw) {
                data = {
                    room: _this.roomName,
                    content: "Draw!"
                };
            }
            else {
                data = {
                    room: _this.roomName,
                    content: _this.roster.players[bestIndex].name + " wins!"
                };
            }
            for (var key in _this.roster.players) {
                _this.roster.players[key].sendMsg("winner", data.content);
            }
        });
    };
    return Game;
}());
module.exports = Game;
