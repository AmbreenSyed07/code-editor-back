require("dotenv").config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require("cors");


connectDB();

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
app.use(cors("*"));

app.use(express.json());
app.use('/api/auth', authRoutes);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User with socket ID ${socket.id} joined room: ${roomId}`);
    });

    socket.on("sendMessage", (data) => {
        console.log(`Message received from ${data.userName} in room ${data.roomId}:`, data.message);

        io.to(data.roomId).emit("message", {
            text: data.message,
            sender: data.userName,
        });
    });

    socket.on('codeChange', (data) => {
        io.to(data.roomId).emit('codeUpdate', data.code);
    });


    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));