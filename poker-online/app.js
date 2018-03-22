"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const index_1 = require("./routes/index");
const user_1 = require("./routes/user");
const room_1 = require("./routes/room");
const Game = require("./routes/game");
const Player = require("./routes/player");
const ChatMessage = require("./routes/chatMessage");
const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);
let games = [new Game("1", 2), new Game("2", 3)];
games[0].initialize();
games[1].initialize();
io.on('connection', (socket) => {
    let url = socket.handshake.headers.referer;
    let re1 = new RegExp("room/1");
    let re2 = new RegExp("room/2");
    let p = new Player(socket);
    let isExist = false;
    let game;
    if (re1.test(url)) {
        game = games[0];
        p.room = '1';
    }
    else if (re2.test(url)) {
        game = games[1];
        p.room = '2';
    }
    else {
    }
    game.enter(p);
    console.log("new", game.roster.players.map(x => x.getSocket().handshake.address));
    socket.on('disconnect', function () {
    });
    socket.on('turn', () => {
        game.openNext();
    });
    socket.on("hand", () => {
        game.judgeHand();
        game.judgeWinner();
    });
    socket.on("new", () => {
        game.distribute();
    });
    socket.on("chat", (txt) => {
        let message = new ChatMessage(p, txt);
        game.messages.push(message);
        for (let key in game.roster.players) {
            game.roster.players[key].sendMsg("chat", game.messages.map(x => x.sender.name + ': ' + x.text));
        }
    });
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use("/", index_1.default);
app.use("/room", room_1.default);
app.use("/users", user_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err["status"] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use((err, req, res, next) => {
        res.status(err["status"] || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});
app.set("port", process.env.PORT || 3000);
var svr = server.listen(app.get("port"), function () {
    debug("Express server listening on port " + server.address().port);
});
//# sourceMappingURL=app.js.map