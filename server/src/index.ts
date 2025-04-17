import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port: 8080});

interface inputSchema {
    socket: WebSocket,
    room: string
}

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
let allSockets: inputSchema[] = [];

wss.on("connection", (socket) => {
    userCount += 1;
    console.log("user connected: ", userCount)

    socket.on("message", (msg: string) => {
        const parsedMessage = JSON.parse(msg);

        if(parsedMessage.type === "join"){
            allSockets.push({
                socket: socket,
                room: parsedMessage.payload.roomId
            })
            socket.send(parsedMessage.payload.roomId)
        }

        if(parsedMessage.type === "chat"){
            const currentUserRoom = allSockets.find(x => x.socket == socket)?.room as string;

            allSockets.map(s => {
                if(s.room === currentUserRoom){
                    s.socket.send(parsedMessage.payload.message)
                }
            })
        }
    })
    socket.on("close", () => {
        userCount -= 1;
        console.log("user disconnected: ", userCount)
        
        allSockets = allSockets.filter(x => x.socket != socket)
        console.log(allSockets.length);
    })
    
})