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
let userCount = 0;
let allSockets = [];
wss.on("connection", (socket) => {
    userCount += 1;
    console.log("user connected: ", userCount);
    socket.on("message", (msg) => {
        var _a;
        const parsedMessage = JSON.parse(msg);
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket: socket,
                room: parsedMessage.payload.roomId
            });
            socket.send(parsedMessage.payload.roomId);
        }
        if (parsedMessage.type === "chat") {
            const currentUserRoom = (_a = allSockets.find(x => x.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
            allSockets.map(s => {
                if (s.room === currentUserRoom) {
                    s.socket.send(parsedMessage.payload.message);
                }
            });
        }
    });
    socket.on("close", () => {
        userCount -= 1;
        console.log("user disconnected: ", userCount);
        allSockets = allSockets.filter(x => x.socket != socket);
        console.log(allSockets.length);
    });
});
