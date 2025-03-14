const socketio = require('socket.io');

module.exports = (server) => {
  const io = socketio(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Listen for chat messages and broadcast them
    socket.on('chatMessage', (msg) => {
      // Broadcast to all connected clients (or implement room logic)
      io.emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

