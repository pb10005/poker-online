import Player = require("./player");

class ChatMessage {
    sender: Player;
    text: string;
    constructor(sender: Player, text: string) {
        this.sender = sender;
        this.text = text;
    }
}

export = ChatMessage;