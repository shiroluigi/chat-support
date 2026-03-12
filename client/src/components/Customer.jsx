import { useState, useEffect, useRef } from "react"
import socket from "../socket"

function Customer() {
    const [room, setRoom] = useState("")
    const [chat, setChat] = useState([])
    const [message, setMessage] = useState("")
    const [chatEnabled, setChatEnabled] = useState(true)
    const chatEndRef = useRef(null)

    useEffect(() => {
        socket.emit("customer_join")
        //disconnect all listeners, before reconnection on mount
        socket.off("room_created")
        socket.off("default_message")
        socket.off("receive_message")
        socket.off("agent_joined")
        socket.off("chat_closed")
        //connect listeners
        socket.on("room_created", (roomId) => setRoom(roomId))
        socket.on("receive_message", (data) => setChat(prev => [...prev, data]))
        socket.on("default_message", (data) => setChat(prev => [...prev, data]));
        socket.on("agent_joined", (data) => setChat(prev => [...prev, data]))
        socket.on("chat_closed", (data) => {
            setChat(prev => [...prev, data])
            setChatEnabled(false)
        })
    }, [])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chat])

    const sendMessage = () => {
        if (!chatEnabled || message.trim() === "") return
        const msg = { room, sender: "Customer", message }
        socket.emit("send_message", msg)
        setMessage("")
    }
    //accessibility
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            sendMessage()
        }
    }

    const reloadPage = () => {
        window.location.reload();
    }

    return (
        <div className="chat-wrapper">
            <div className="chat-container">
                <div className="chat-header">
                    <h2>Support Chat</h2>
                    <span className={chatEnabled ? "status-open" : "status-closed"}>
                        {chatEnabled ? "Online" : "Closed"}
                    </span>
                </div>

                <div className="chat-messages">
                    {chat.map((m, i) => {
                        const isSelf = m.sender === "Customer"
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
                        disabled={!chatEnabled}
                        placeholder={chatEnabled ? "Type a message..." : "Connection closed."}
                    />
                    <button onClick={sendMessage} disabled={!chatEnabled}>Send</button>
                </div>

                {!chatEnabled && (
                    <p style={{ color: "red", textAlign: "center", margin: "8px 0" }}>
                        Connection closed please <span onClick={reloadPage} style={
                            {
                                color: "blue",
                                cursor: "pointer",
                            }
                        }><u>reload.</u></span>
                    </p>
                )}
            </div>
        </div>
    )
}

export default Customer