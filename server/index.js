const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
require('dotenv').config()
const urlrouter = require('./routes');
app.use(cors());

app.use(express.json());
const emailtoSocketIdmap = new Map()
const socketIDtoEmailmap = new Map()

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  connectTimeoutMS: 6000,
})
  .then(() => {
    console.log("Connected to the MongoDB server");
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/', urlrouter);
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log('Server started on port 5000');
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});
io.on('connection', (socket) => {
  console.log("connected to io");
  socket.on('setup', (user) => {
    socket.join(user._id)
    socket.emit("connected")
  })
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on('new message', (userMessage) => {
    var chat = userMessage.Chat;
    if (!chat?.users) {
      console.log('no users in chat')
    }
    chat?.users.forEach((user) => {
      if (user._id != userMessage.sender._id)
        socket.to(user._id).emit("message recieved", userMessage);
      else
        return;
    });

  })
  socket.on("start typing", (room) => {
    socket.in(room.id).emit("typing", room)
  });
  socket.on("stop typing", (room) => socket.in(room).emit("not typing", room));

  socket.on("Join-Lobby", (id) => {
    emailtoSocketIdmap.set(id, socket.id)
    socketIDtoEmailmap.set(socket.id, id)
    socket.to(id).emit("UserJoined", id)
  })

  socket.on("user-call", ({ to, offer }) => {
    socket.to(to).emit("incomming-call", { from: socket.id, offer })
  })

  socket.on('call-accepted', ({ to, ans }) => {
    socket.to(to).emit("call:accepted", { from: socket.id, ans })

  })
  socket.on("nego-needed", ({ offer, to }) => {
    socket.to(to).emit("nego:needed", { from: socket.id, offer })

  })
  socket.on("nego-done", ({ to, ans }) => {
    socket.to(to).emit("nego:done", { from: socket.id, ans })

  })
  socket.on("call-ended",({id})=>{
    socket.to(id).emit("call-ended",id)
  })
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
}) 