"use strict";
const async = require("async");
class Roster {
    constructor() {
        this.sockets = [];
    }
    add(socket) {
        this.sockets.push(socket);
        this.update(socket);
    }
    remove(socket) {
        this.sockets.splice(this.sockets.indexOf(socket), 1);
        this.update(socket);
    }
    update(socket) {
        async.map(this.sockets, function (socket, callback) {
            callback(null, { name: socket.id });
        }, function (err, names) {
            socket.emit('roster', names);
            socket.broadcast.emit('roster', names);
        });
    }
}
module.exports = Roster;
//# sourceMappingURL=web_socket.js.map