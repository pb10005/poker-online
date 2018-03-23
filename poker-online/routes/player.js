"use strict";
var initChip = 100;
var Player = (function () {
    function Player(socket) {
        this.socket = socket;
        this.address = socket.handshake.address;
        this.hole = [];
        this.chip = initChip;
        socket.on('bet', function (obj) {
            //ベット時の挙動
        });
    }
    Player.prototype.succeed = function (player) {
        this.socket = player.getSocket();
        player.name = this.name;
    };
    Player.prototype.setHole = function (cards) {
        this.hole = cards;
        this.sendMsg("hole", cards);
    };
    Player.prototype.getHole = function () {
        return this.hole;
    };
    Player.prototype.setBestHand = function (hand) {
        this.bestHand = hand;
        this.sendMsg("hand", hand.getRank());
    };
    Player.prototype.getBestHand = function () {
        return this.bestHand;
    };
    Player.prototype.getSocket = function () {
        return this.socket;
    };
    Player.prototype.sendMsg = function (type, obj) {
        var data = {
            room: this.room,
            content: obj
        };
        this.socket.emit(type, data);
    };
    Player.prototype.broadcast = function (type, obj) {
        var data = {
            room: this.room,
            content: obj
        };
        this.socket.broadcast.emit(type, data);
    };
    return Player;
}());
module.exports = Player;
//# sourceMappingURL=player.js.map