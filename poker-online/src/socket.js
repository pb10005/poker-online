const io = require("socket.io-client");
const async = require("async");

let socket = io.connect();

socket.on('connect', () => {
    console.log('connected');
});

socket.on('roster', (data) => {
    if (data.room !== document.getElementById('room').textContent) return;
    let names = data.content;
    console.log(names);
});

socket.on('join', (data) => {
    if (data.room !== document.getElementById('room').textContent) return;
    let msg = data.content;
    console.log(msg);
});

socket.on('hole', (data) => {
    if (data.room !== document.getElementById('room').textContent) return;
    let cards = data.content;
    console.log('hole cards', cards);
    async.map(
        cards,
        function (card, callback) {
            callback(null, card.screenName);
        },
        function (err, names) {
            document.getElementById('hand').textContent = names.join(' ');
        }
    );
});

socket.on('community', (data) => {
    if (data.room !== document.getElementById('room').textContent) return;
    let cards = data.content;
    console.log('community cards', cards);
    async.map(
        cards,
        function (card, callback) {
            callback(null, card.screenName);
        },
        function (err, names) {
            document.getElementById('community').textContent = names.join(' ');
        }
    );
});

socket.on('player', (data) => {
    if (data.room !== document.getElementById('room').textContent) return;
    let num = data.content;
    document.getElementById('num').textContent = num;
});

socket.on('hand', (data) => {
    if (data.room !== document.getElementById('room').textContent) return;
    let hand = data.content;
    console.log("your hand: ", hand);
    document.getElementById('hand_name').textContent = hand.name;
});

socket.on('name', (data) => {
    if (data.room !== document.getElementById('room').textContent) return;
    let name = data.content;
    document.getElementById('name').textContent = name;
});

socket.on('winner', (data) => {
    if (data.room !== document.getElementById('room').textContent) return;
    alert(data.content);
});

module.exports = socket;