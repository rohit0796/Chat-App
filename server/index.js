const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const urlrouter = require('./routes');
app.use(cors());

const db = "mongodb+srv://rohit:Rohit@cluster0.iz0xyeb.mongodb.net/ChatApp?retryWrites=true&w=majority";


app.use(express.json());


mongoose.connect(db, {
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

const server = app.listen(1337, () => {
  console.log('Server started on port 1337');
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
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
    socket.in(room.id).emit("typing",room)
  });
  socket.on("stop typing", (room) => socket.in(room).emit("not typing",room));

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
}) 