import async = require("async");
import Player = require("./player");

class Roster {
    //socketの接続を管理する
    players: Player[];
    constructor() {
        this.players = [];
    }
    add(player: Player): void {
        this.players.push(player);
        this.update(player);
    }
    remove(player: Player): void {
        this.players.splice(this.players.indexOf(player), 1);
        this.update(player);
    }
    update(player: Player) {
        async.map(
            this.players,
            function (player, callback) {
                callback(null, { name: player.name });
            },
            function (err, names) {
                player.sendMsg('roster', names);
                player.broadcast('roster', names);
            }
        );
    }
}

export = Roster;