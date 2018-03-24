//Paginationの参考URL
//https://kuroeveryday.blogspot.jp/2015/07/Vuejs-Pagination.html

const socket = require("./socket");
import Vue from "vue";

let vm = new Vue({
    el: "#app",
    data: {
        text: "",
        winner: "",
        items: [],
        hands: [],
        results: [],
        dispItemSize: 10,
        page: 0
    },
    methods: {
        init() {
            this.text = "";
            this.winner = "";
            this.items = [];
            this.hands = [];
            this.results = [];
            this.page = 0;
        },
        next(){
            socket.emit("turn");
        },
        hand(){
            socket.emit("hand");
        },
        newGame(){
            socket.emit("new");
        },
        submit(){
            socket.emit("chat", this.text);
        },
        showPrev() {
            if (this.isStartPage) return;
            this.page--;
        },
        quit() {
            socket.emit("quit");
        },
        showNext() {
            if (this.isEndPage) return;
            this.page++;
        }
    },
    computed: {
        dispItems() {
            var startPage = this.page * this.dispItemSize;
            return this.items.slice(startPage, startPage + this.dispItemSize);
        },
        isStartPage() {
            return this.page === 0;
        },
        isEndPage() {
            return (this.page + 1) * this.dispItemSize >= this.items.length;
        }
    }
});

socket.on('chat', (messages) => {
    vm.items = messages.content.reverse();
});

socket.on('result', (data) => {
    if (data.room !== document.getElementById('room').textContent) return;
    console.log("results", data.content);
    vm.results = data.content;
});

socket.on('reset', (obj) => {
    vm.init();
    console.log("initialized");
});

socket.on('winner', (data) => {
    if (data.room !== document.getElementById('room').textContent) return;
    vm.winner = data.content;
});