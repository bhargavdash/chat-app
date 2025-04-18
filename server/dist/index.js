"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
// user can do 2 things - 
// 1. join the room 
// 2. send a message in the room
// schema for join - {
// "type": "join",
// "payload": {
//         "roomId": "123123"
//     }
// }
// schema for chat - {
// "type": "chat",
// "payload": {
//     "message": "Hi there"
// }
// }
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (msg) => {
        var _a, _b;
        try {
            const parsedMessage = JSON.parse(msg);
            if (parsedMessage.type === "join") {
                console.log(parsedMessage.payload.username + " has joined room: ", parsedMessage.payload.roomId);
                allSockets.push({
                    socket: socket,
                    room: parsedMessage.payload.roomId,
                    username: parsedMessage.payload.username
                });
            }
            if (parsedMessage.type === "chat") {
                const currentUserRoom = (_a = allSockets.find(x => x.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
                const sender = (_b = allSockets.find((s) => s.socket == socket)) === null || _b === void 0 ? void 0 : _b.username;
                allSockets.map(s => {
                    if (s.room === currentUserRoom) {
                        if (s.socket == socket) {
                            s.socket.send(JSON.stringify({
                                "sender": sender,
                                "text": parsedMessage.payload.message,
                                "src": true
                            }));
                        }
                        else {
                            s.socket.send(JSON.stringify({
                                "sender": sender,
                                "text": parsedMessage.payload.message,
                                "src": false
                            }));
                        }
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    });
    socket.on("close", () => {
        allSockets = allSockets.filter(x => x.socket != socket);
        console.log(allSockets.length);
    });
});
