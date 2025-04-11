import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import cloudinary from "../src/lib/cloudinary.js";
import User from "../src/models/user.model.js";
import { protectRoute } from "./middleware/auth.middlewate.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// ✅ دعم localhost و 10.0.2.2
const allowedOrigins = [
  "http://localhost:5173", // للجهاز المحلي
  "http://10.0.2.2:5173", // للإيموليتر
];

const server = http.createServer(app);

// ✅ إعداد socket.io مع CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ ميدل وير
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ الراوتس
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// ✅ Socket.IO logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User with ID ${socket.id} joined room ${roomId}`);
  });

  socket.on("send_message", (data) => {
    console.log("Sending message to room:", data.room);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Connect to MongoDB then start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
      console.log("MongoDB URI:", process.env.MONGO_URI);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
