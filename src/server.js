const express = require("express");
const http = require("http"); // Required for integrating Socket.IO
const { Server } = require("socket.io"); // Import Socket.IO
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const app = express();
const server = http.createServer(app); // Wrap the app with an HTTP server
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

  // Listen for joining a chat
  socket.on("joinChat", ({ userId, chatWith }) => {
    const room = [userId, chatWith].sort().join("_"); // Generate unique room ID
    socket.join(room);
    console.log(`User ${userId} joined room ${room}`);
  });

  // Listen for messages and broadcast them
  socket.on("sendMessage", (messageData) => {
    const { sender, receiver, message } = messageData;
    const room = [sender, receiver].sort().join("_");
    io.to(room).emit("receiveMessage", messageData); // Emit to the room
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
