import { Server } from "socket.io";
import express from "express";
import http from "http";
import { log } from "console";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User Connected: UserId = ${userId}, SocketId=${socket.id}`);
  }

  io.emit("getOnlinerUser", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      console.log(
        `User Disconnected: UserId = ${userId}, SocketId=${socket.id}`
      );
      delete userSocketMap[userId];
    }
    io.emit("getOnlinerUser", Object.keys(userSocketMap));
  });
});

export { app, server, io };
