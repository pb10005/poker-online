"use strict";
const initChip = 100;
class Player {
    constructor(socket) {
        this.socket = socket;
        this.address = socket.handshake.address;
        this.hole = [];
        this.chip = initChip;
        socket.on('bet', (obj) => {
            //ベット時の挙動
        });
    }
    succeed(player) {
        this.socket = player.getSocket();
        player.name = this.name;
    }
    setHole(cards) {
        this.hole = cards;
        this.sendMsg("hole", cards);
    }
    getHole() {
        return this.hole;
    }
    setBestHand(hand) {
        this.bestHand = hand;
        this.sendMsg("hand", hand.getRank());
    }
    getBestHand() {
        return this.bestHand;
    }
    getSocket() {
        return this.socket;
    }
    sendMsg(type, obj) {
        let data = {
            room: this.room,
            content: obj
        };
        this.socket.emit(type, data);
    }
    broadcast(type, obj) {
        let data = {
            room: this.room,
            content: obj
        };
        this.socket.broadcast.emit(type, data);
    }
}
module.exports = Player;
//# sourceMappingURL=player.js.map