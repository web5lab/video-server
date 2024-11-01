// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust based on security requirements
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log("user joined",roomId);
    socket.to(roomId).emit('user-joined', socket.id);
  });

  socket.on('offer', (data) => {
    io.to(data.target).emit('offer', { sdp: data.sdp, sender: socket.id });
  });

  socket.on('answer', (data) => {
    io.to(data.target).emit('answer', { sdp: data.sdp, sender: socket.id });
  });

  socket.on('ice-candidate', (data) => {
    io.to(data.target).emit('ice-candidate', { candidate: data.candidate, sender: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    socket.broadcast.emit('user-disconnected', socket.id);
  });
});

const PORT = 5055; // port
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
