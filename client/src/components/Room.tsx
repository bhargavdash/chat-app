import { useEffect, useRef, useState } from "react"
import { CopyIcon } from "./icons/CopyIcon"
import { Button } from "./ui/button"
import Swal from 'sweetalert2'

interface RoomProps {
    roomId: string,
    setInRoom: React.Dispatch<React.SetStateAction<boolean>>,
    socket: WebSocket
}

interface msgInterface {
    sender: string,
    text: string, 
    src: boolean
}

export const Room = (props: RoomProps) => {

    const inputRef = useRef<HTMLInputElement>(null)
    const [messages, setMessages] = useState<msgInterface[]>([])

    const chatEndRef = useRef<HTMLDivElement>(null)

    const scrollToEnd = () => {
        chatEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    useEffect(() => {
        props.socket.onmessage = (e) => {
            setMessages((prev) => [...prev, JSON.parse(e.data)])
        }
    }, [props.socket])

    useEffect(() => {
        scrollToEnd()
    }, [messages])

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

        
        inputRef.current!.value = ""
    }

    console.log(messages)

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
        <div className="border border-dashed h-56 w-full rounded-sm overflow-y-auto">
            {messages.map((msg, index) => {
                return <div key={index}
                    className={`bg-gray-700 rounded-sm max-w-fit p-1 m-2 ${msg.src == true ? "ml-auto": ""}`}
                >
                    <div className='bg-black text-[10px] max-w-fit p-[2px] rounded-sm'>{msg.sender}</div>
                    <div>{msg.text}</div>
                </div>
            })}
            <div ref={chatEndRef} />
        </div>
        <div className="flex gap-2 mt-5">
            <input ref={inputRef} onKeyDown={(e) => {
                if(e.key === "Enter"){
                    handleSendMsg()
                }
            }} className="bg-gray-700 rounded-sm w-[90%] pl-4 py-1" type="text" />
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