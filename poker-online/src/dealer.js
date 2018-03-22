//Paginationの参考URL
//https://kuroeveryday.blogspot.jp/2015/07/Vuejs-Pagination.html

const socket = require("./socket");
import Vue from "vue";

let vm = new Vue({
    el: "#app",
    data: {
        text: "",
        items: [],
        hands: [],
        dispItemSize: 10,
        page: 0
    },
    methods: {
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
