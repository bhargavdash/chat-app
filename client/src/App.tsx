import { useState, useEffect } from "react"
import { Lobby } from "./components/Lobby"

function App() {
  const [socket, setSocket] = useState<WebSocket>()

  useEffect(() => {
    // const ws = new WebSocket("wss://chat-app-ev3n.onrender.com");
    const ws = new WebSocket("ws://localhost:8080")
    
    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [])


  return (
    <>
      <div className='font-serif text-white h-screen flex flex-col items-center gap-10 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'>
        <div className='mt-8 font-bold text-3xl'>
          <h1>Welcome to chat room</h1>
        </div>
        {socket && <div>
          <Lobby 
          socket={socket}
          />
        </div>}
      </div>
    </>
  )
}

export default App
