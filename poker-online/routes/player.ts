import Card = require("./card");
import Hand = require("./hand");
const initChip = 100;
class Player{
    //Adapter Class of socket
    name: string;
    address: string;
    room: string;
    chip: number; 
    private socket: any;
    private bestHand: Hand;
    private hole: Array<Card>;
    constructor(socket) {
        this.socket = socket;
        this.address = socket.handshake.address;
        this.hole = [];
        this.chip = initChip;
        socket.on('bet', (obj) => {
            //ベット時の挙動
        });
    }
    succeed(player: Player): void{
        this.socket = player.getSocket();
        player.name = this.name;
    }
    setHole(cards: Array<Card>): void {
        this.hole = cards;
        this.sendMsg("hole", cards);
    }
    getHole(): Array<Card> {
        return this.hole;
    }
    setBestHand(hand: Hand):void{
        this.bestHand = hand;
        this.sendMsg("hand", hand.getRank());
    }
    getBestHand(): Hand {
        return this.bestHand;
    }
    getSocket(): any {
        return this.socket;
    }
    sendMsg(type: string, obj: any) {
        let data = {
            room: this.room,
            content: obj
        };
        this.socket.emit(type, data);
    }
    broadcast(type: string, obj: any) {
        let data = {
            room: this.room,
            content: obj
        };
        this.socket.broadcast.emit(type, data);
    }
}

export = Player;