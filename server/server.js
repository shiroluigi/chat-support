const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
app.use(cors())

const server = http.createServer(app)
//Socket.io server
const io = new Server(server, {
    cors: { origin: "*" }
})

let rooms = {}

function getAvailableRooms() {
    return Object.keys(rooms).filter(room => rooms[room].agent === null)
}

//Socket.io handles
io.on("connection", (socket) => {
    socket.on("customer_join", () => {
        const room = "room_" + socket.id
        rooms[room] = {
            customer: socket.id,
            agent: null
        }
        socket.join(room)
        socket.emit("room_created", room)
        socket.emit("default_message", {room, sender: 'System',message: `You've joined ${room}`})
        io.emit("rooms_list", getAvailableRooms())
    })

    socket.on("get_rooms", () => {
        socket.emit("rooms_list", getAvailableRooms())
    })

    socket.on("join_room", (room) => {

        if (!rooms[room]) return
        if (rooms[room].agent !== null) {

            socket.emit("room_busy", {
                message: "Another agent already joined, please reload."
            })

            return
        }

        rooms[room].agent = socket.id
        socket.join(room)
        io.to(room).emit("agent_joined", {
            sender: "System",
            message: "Agent joined the chat"
        })

        io.emit("rooms_list", getAvailableRooms())

    })

    socket.on("exit_room", (room) => {

        if (!rooms[room]) return

        if (rooms[room].agent === socket.id) {

            socket.leave(room)

            io.to(room).emit("chat_closed", {
                sender: "System",
                message: "Agent left the chat"
            })

            delete rooms[room]

            io.emit("rooms_list", getAvailableRooms())

        }

    })

    socket.on("send_message", (data) => {
        io.to(data.room).emit("receive_message", data)
    })

    socket.on("disconnect", () => {

        for (const room in rooms) {

            if (rooms[room].customer === socket.id) {
                io.to(room).emit("chat_closed",{
                    sender: "System",
                    message: "Customer disconnected."
                })
                io.emit("rooms_list", getAvailableRooms())
                delete rooms[room]
                io.emit("rooms_list", getAvailableRooms())
            }

            if (rooms[room] && rooms[room].agent === socket.id) {

                io.to(room).emit("chat_closed", {
                    sender: "System",
                    message: "Agent disconnected."
                })

                delete rooms[room]
                io.emit("rooms_list", getAvailableRooms())

            }

        }

    })

})

server.listen(5000, () => {
    console.log("Server running on port 5000")
})