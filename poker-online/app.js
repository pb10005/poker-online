"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var express = require("express");
var path = require("path");
var http = require("http");
var socketio = require("socket.io");
var index_1 = require("./routes/index");
var user_1 = require("./routes/user");
var room_1 = require("./routes/room");
var Game = require("./routes/game");
var Player = require("./routes/player");
var ChatMessage = require("./routes/chatMessage");
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);
var games = [new Game("1", 2), new Game("2", 3)];
games[0].initialize();
games[1].initialize();
io.on('connection', function (socket) {
    var url = socket.handshake.headers.referer;
    var re1 = new RegExp("room/1");
    var re2 = new RegExp("room/2");
    var p = new Player(socket);
    var isExist = false;
    var game;
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
    console.log("new", game.roster.players.map(function (x) { return x.getSocket().handshake.address; }));
    socket.on('disconnect', function () {
    });
    socket.on('turn', function () {
        game.openNext();
    });
    socket.on("hand", function () {
        game.judgeHand();
        game.judgeWinner();
    });
    socket.on("new", function () {
        game.distribute();
    });
    socket.on("quit", function () {
        console.log("quit", p.name);
        game.quit(p);
    });
    socket.on("chat", function (txt) {
        var message = new ChatMessage(p, txt);
        game.messages.push(message);
        for (var key in game.roster.players) {
            game.roster.players[key].sendMsg("chat", game.messages.map(function (x) { return x.sender.name + ': ' + x.text; }));
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
    app.use(function (err, req, res, next) {
        res.status(err["status"] || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
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