const express = require("express");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");

const app = express();
const http = require("http");

// Socket.IO setup
const server = http.createServer(app); // Keep this to work with Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", ({ userId, chatWith }) => {
    const room = [userId, chatWith].sort().join("_"); // Generate unique room ID
    socket.join(room);
    console.log(`User ${userId} joined room ${room}`);
  });

  socket.on("sendMessage", (messageData) => {
    const { sender, receiver, message } = messageData;
    const room = [sender, receiver].sort().join("_");
    io.to(room).emit("receiveMessage", messageData); // Emit to the room
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Vercel handles listening for requests, so we will export the server function
module.exports = app;
