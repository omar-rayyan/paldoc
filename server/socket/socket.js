import { Server } from 'socket.io';

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    }
  });

  const userSockets = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register', (userId) => {
      userSockets.set(userId, socket.id);
    });

    socket.on('send_message', async (data) => {
      const recipientSocket = userSockets.get(data.recipientId);
      if (recipientSocket) {
        io.to(recipientSocket).emit('receive_message', data);
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export default initializeSocket;