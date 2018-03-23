"use strict";
var async = require("async");
var Roster = (function () {
    function Roster() {
        this.players = [];
    }
    Roster.prototype.add = function (player) {
        this.players.push(player);
        this.update(player);
    };
    Roster.prototype.remove = function (player) {
        this.players.splice(this.players.indexOf(player), 1);
        this.update(player);
    };
    Roster.prototype.update = function (player) {
        async.map(this.players, function (player, callback) {
            callback(null, { name: player.name });
        }, function (err, names) {
            player.sendMsg('roster', names);
            player.broadcast('roster', names);
        });
    };
    return Roster;
}());
module.exports = Roster;
