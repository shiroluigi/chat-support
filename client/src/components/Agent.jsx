import { useState, useEffect, useRef } from "react"
import socket from "../socket"

function Agent() {
    const [rooms, setRooms] = useState([])
    const [room, setRoom] = useState("")
    const [chat, setChat] = useState([])
    const [message, setMessage] = useState("")
    const [chatEnabled,setChatEnabled] = useState(true);
    const chatEndRef = useRef(null)

    useEffect(() => {
        //remove listeners
        socket.emit("get_rooms")
        socket.off("rooms_list")
        socket.off("receive_message")
        socket.off("agent_joined")
        socket.off("chat_closed")
        //listeners
        socket.on("rooms_list", (data) => setRooms(data))
        socket.on("room_busy", (data) => alert(data.message))
        socket.on("receive_message", (data) => setChat(prev => [...prev, data]))
        socket.on("agent_joined", (data) => setChat(prev => [...prev, data]))
        socket.on("chat_closed", (data) => { 
            setChat(prev => [...prev, data]);
            setChatEnabled(false);
        })
    }, [])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chat])

    const joinRoom = (roomId) => {
        setRoom(roomId)
        setChat([])
        socket.emit("join_room", roomId)
    }

    const exitRoom = () => {
        socket.emit("exit_room", room)
        setRoom("")
        setChat([])
    }

    const sendMessage = () => {
        if (message === "") return
        const msg = { room, sender: "Agent", message }
        socket.emit("send_message", msg)
        setMessage("")
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="chat-wrapper">
            <div className="chat-container">
                <div className="chat-header">
                    <h2>{room ? `Room: ${room}` : "Agent Dashboard"}</h2>
                    {room && (
                        <button onClick={exitRoom}>Exit</button>
                    )}
                </div>

                {!room ? (
                    <div className="chat-messages">
                        {rooms.length === 0 && (
                            <p style={{ opacity: 0.4, textAlign: "center" }}>No active rooms</p>
                        )}
                        {rooms.map(r => (
                            <button key={r} onClick={() => joinRoom(r)}>
                                Join {r}
                            </button>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="chat-messages">
                            {chat.map((m, i) => {
                                const isSelf = m.sender === "Agent"
                                return (
                                    <div key={i} className={`message-row ${isSelf ? "self" : "other"}`}>
                                        {!isSelf && <span className="message-sender">{m.sender}</span>}
                                        <div className="message-bubble">{m.message}</div>
                                    </div>
                                )
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="chat-footer">
                            <input
                                className="chat-input"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={chatEnabled? "Type a message..." : "Please Exit."}
                                disabled = {!chatEnabled}
                            />
                            <button onClick={sendMessage} disabled={!chatEnabled}>Send</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Agent