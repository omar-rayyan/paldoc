import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    }
  });

  const userSockets = new Map();

  // Helper function to extract user ID from JWT token
  const getUserIdFromToken = (handshake) => {
    try {
      // Try to get token from cookies first
      const cookies = handshake.headers.cookie;
      if (cookies) {
        const userTokenMatch = cookies.match(/usertoken=([^;]+)/);
        if (userTokenMatch) {
          const token = userTokenMatch[1];
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          return decoded.id;
        }
      }
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
    }
    return null;
  };

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Extract user ID from JWT token and register socket
    const userId = getUserIdFromToken(socket.handshake);
    if (userId) {
      userSockets.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    }

    socket.on('register', (providedUserId) => {
      // Allow manual registration as backup
      userSockets.set(providedUserId, socket.id);
    });

    socket.on('send_message', async (data) => {
      const recipientSocket = userSockets.get(data.recipientId);
      if (recipientSocket) {
        io.to(recipientSocket).emit('receive_message', data);
      }
    });

    socket.on('send_notification', async (data) => {
      const recipientSocket = userSockets.get(data.userId);
      if (recipientSocket) {
        io.to(recipientSocket).emit('receive_notification', data);
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

export default initializeSocket;