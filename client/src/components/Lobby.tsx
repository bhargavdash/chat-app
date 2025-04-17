import { useState } from "react";
import { Room } from "./Room";

interface LobbyProps {
    socket: WebSocket,
}

export const Lobby = (props: LobbyProps) => {
    const [roomId, setRoomId] = useState<number>(0)
    const [inRoom, setInRoom] = useState(false)
    const createRoom = () => {
        // generate a random roomId and send the message to backend server
        const obj = {
            type: "join",
            payload: {
                roomId: Math.floor(Math.random()*10000)
            }
        }
        props.socket.send(JSON.stringify(obj))
        props.socket.onmessage = (e) => {
            setRoomId(e.data) 
        }

        setInRoom(true)
    }

    console.log("Room Id: ", roomId)
    return <>
        {!inRoom && <div className="border h-64 w-96 p-4">
            <div>
                <div>
                    <p className='text-md mb-5'>Enter room code to join</p>
                    <input className='bg-gray-800 w-full rounded-sm p-2' type="text" />
                </div>
            </div>
            <div onClick={createRoom} className='hover:cursor-pointer hover:bg-gray-700 translate-all transform duration-300 mt-10 p-2 flex justify-center items-center w-full bg-gray-800 rounded-sm'>
                Create room
            </div>
        </div>}

        {inRoom && <div className="border h-[400px] w-[700px] p-4 flex flex-col justify-between">
            <Room  
                roomId={roomId}
                setInRoom={setInRoom}
                socket={props.socket}
            />
            </div>}
    </>
}