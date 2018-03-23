import debug = require("debug");
import express = require("express");
import path = require("path");
import http = require("http");
import socketio = require("socket.io");
import async = require("async");

import routes from "./routes/index";
import users from "./routes/user";
import gameRooms from "./routes/room";
import Game = require("./routes/game");
import Player = require("./routes/player");
import ChatMessage = require("./routes/chatMessage");

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

let games: Array<Game> = [new Game("1", 2), new Game("2", 3)];
games[0].initialize();
games[1].initialize();
io.on('connection', (socket) => {
    let url = socket.handshake.headers.referer;
    let re1 = new RegExp("room/1");
    let re2 = new RegExp("room/2");
    let p: Player = new Player(socket);
    let isExist = false;
    let game: Game;
    if (re1.test(url)) {
        game = games[0];
        p.room = '1';
    }
    else if(re2.test(url)) {
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
    socket.on("quit", () => {
        console.log("quit", p.name);
        game.quit(p);
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

app.use("/", routes);
app.use("/room", gameRooms);
app.use("/users", users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err["status"] = 404; 
  next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use((err: any, req, res, next) => {
    res.status(err["status"] || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

app.set("port", process.env.PORT || 3000);

var svr = server.listen(app.get("port"), function() {
  debug("Express server listening on port " + server.address().port);
});