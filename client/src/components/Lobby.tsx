import { useState, useRef } from "react";
import { Room } from "./Room";

interface LobbyProps {
    socket: WebSocket,
}

export const Lobby = (props: LobbyProps) => {
    const [roomId, setRoomId] = useState<string>("")
    const [inRoom, setInRoom] = useState(false)
    const userNameRef = useRef<HTMLInputElement>(null)
    const roomRef = useRef<HTMLInputElement>(null)

    const createRoom = () => {
        // generate a random roomId and send the message to backend server
        const roomId = Math.floor(Math.random()*10000).toString()
        const obj = {
            type: "join",
            payload: {
                roomId: roomId,
                username: userNameRef.current?.value
            }
        }
        props.socket.send(JSON.stringify(obj))

        setRoomId(roomId)

        setInRoom(true)
    }

    const joinRoom = () => {
        const obj = {
            type: "join",
            payload: {
                roomId: roomRef.current?.value,
                username: userNameRef.current?.value
            }
        }
        props.socket.send(JSON.stringify(obj))
        setRoomId(roomRef.current?.value as string)
        setInRoom(true)
    }


    console.log("Room Id: ", roomId)
    return <>
        {!inRoom && <div className="border border-dashed h-[400px] w-[400px] p-4 flex flex-col" >
            <div>
                <div>
                    <p className='text-md mb-5'>Enter a name to chat with</p>
                    <input ref={userNameRef} className='bg-gray-800 w-full rounded-sm p-2' type="text" />
                </div>
            </div>
            <div onClick={createRoom} className='hover:cursor-pointer hover:bg-gray-700 translate-all transform duration-300 mt-5 p-2 flex justify-center items-center w-full bg-gray-800 rounded-sm'>
                Create room
            </div>
            <div className='mx-auto mt-6'>
                OR
            </div>
            <div>
                <div>
                    <p className='text-md mb-5'>Enter room code to join</p>
                    <input ref={roomRef} className='bg-gray-800 w-full rounded-sm p-2' type="text" />
                </div>
            </div>
            <div onClick={joinRoom} className='hover:cursor-pointer hover:bg-gray-700 translate-all transform duration-300 mt-10 p-2 flex justify-center items-center w-full bg-gray-800 rounded-sm'>
                Join room
            </div>
            
        </div>}

        {inRoom && <div className="border border-dashed h-[400px] w-[700px] p-4 flex flex-col justify-between">
            <Room  
                roomId={roomId}
                setInRoom={setInRoom}
                socket={props.socket}
            />
            </div>}
    </>
}