import { useRef, useState } from "react"
import { CopyIcon } from "./icons/CopyIcon"
import { Button } from "./ui/button"
import Swal from 'sweetalert2'

interface RoomProps {
    roomId: number,
    setInRoom: React.Dispatch<React.SetStateAction<boolean>>,
    socket: WebSocket
}

export const Room = (props: RoomProps) => {

    const inputRef = useRef<HTMLInputElement>(null)
    const [message, setMessage] = useState()


    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(props.roomId.toString())
        .then(() => {
            Swal.fire({
                title: "RoomId copied to clipboard",
                icon: "success",
                timer: 2000
            })
        })
    }

    const handleSendMsg = () => {
        const obj = {
            type: "chat",
            payload: {
                message: inputRef.current?.value
            }
        }

        props.socket.send(JSON.stringify(obj))

        props.socket.onmessage = (e) => {
            setMessage(e.data)
        }
    }

    return <>
    <div>
        <div className='flex gap-2 items-center mb-2'>
            <p>RoomId: </p>
            <input className="bg-gray-700 rounded-sm w-[90%] pl-4 py-1" 
            readOnly
            value={props.roomId} 
            type="text" />
            <CopyIcon 
            onClick={handleCopyRoomId}
             />
        </div>
        <div className="border h-56 w-full rounded-sm">
            {message}
        </div>
        <div className="flex gap-2 mt-5">
            <input ref={inputRef} className="bg-gray-700 rounded-sm w-[90%] pl-4 py-1" type="text" />
            <Button 
                type="button"
                variant="secondary"
                onClick={handleSendMsg}
                >
                Send
            </Button>
        </div>

    </div>
    <div>
        <Button 
            type="button"
            variant="secondary"
            onClick={() => props.setInRoom(false)}
            >
            Exit
        </Button>
    </div>

    </>
}