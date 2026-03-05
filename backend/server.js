import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import DirectMessage from './models/DirectMessage.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';


import studentRoutes from './routes/studentRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import escalationRoutes from './routes/escalationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import ambassadorRoutes from './routes/ambassadorRoutes.js';
import journalRoutes from './routes/journalRoutes.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/student', studentRoutes); // Alias for literal match requirements
app.use('/api/assignments', ambassadorRoutes);
app.use('/api/ambassadors', ambassadorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/escalations', escalationRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/journals', journalRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Socket.IO logic
// Maps userId to their current socket.id
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log(`User connected to socket: ${socket.id}`);

    // When a user identifies themselves by ID
    socket.on('join', (userId) => {
        connectedUsers.set(userId, socket.id);
        console.log(`User ${userId} joined via socket ${socket.id}`);
    });

    // Handling message passing
    socket.on('sendMessage', async (data) => {
        try {
            const { senderId, receiverId, message } = data;

            // 1. Save Chat message in MongoDB
            const newMessage = new DirectMessage({
                senderId,
                receiverId,
                message
            });
            await newMessage.save();

            // 2. Identify if receiver is currently connected to websocket
            const receiverSocketId = connectedUsers.get(receiverId);

            // Emit to receiver directly if online
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receiveMessage', newMessage);
            }

            // Also emit back to sender to confirm
            socket.emit('receiveMessage', newMessage);

        } catch (error) {
            console.error('Socket error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        // Remove from connected users map
        for (const [userId, sockId] of connectedUsers.entries()) {
            if (sockId === socket.id) {
                connectedUsers.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
