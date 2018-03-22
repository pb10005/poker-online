"use strict";
const async = require("async");
class Roster {
    constructor() {
        this.players = [];
    }
    add(player) {
        this.players.push(player);
        this.update(player);
    }
    remove(player) {
        this.players.splice(this.players.indexOf(player), 1);
        this.update(player);
    }
    update(player) {
        async.map(this.players, function (player, callback) {
            callback(null, { name: player.name });
        }, function (err, names) {
            player.sendMsg('roster', names);
            player.broadcast('roster', names);
        });
    }
}
module.exports = Roster;
//# sourceMappingURL=roster.js.map