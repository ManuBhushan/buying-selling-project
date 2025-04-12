import express from "express";
import userRouter from "./routes/userRouter";
import cors from "cors";
import adsRouter from "./routes/adsRouter";
import likeRouter from "./routes/likeRouter";
import messageRouter from "./routes/messageRouter";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config";
import * as path from "path";

const app = express();
const projectRoot = path.resolve(__dirname, "..");
const map = new Map();
const port = 3000;
const httpserver = createServer(app);

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

const io = new Server(httpserver, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  map.set(userId, socket.id);
  const isValid = socket.handshake.query.isValid;
  console.log("Socket connected with Socket id: ", socket.id);
  socket.on("private-message", (data) => {
    const { message, receiverId, adId, senderName, title } = data;
    //    console.log("private-message: ",data);
    io.to(map.get(String(receiverId))).emit("private-message", {
      message,
      adId,
      senderId: userId,
    });
    //    io.to((map.get(String(receiverId)))).emit("notification",{senderName,title,message});
  });

  socket.on("disconnect", (reason) => {
    map.delete(String(userId));
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/ads", adsRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v2/message", messageRouter);
app.use("/uploads", express.static(path.join(projectRoot, config.UPLOADS_DIR)));

httpserver.listen(port, () => {
  console.log("Server is listening on port: ", port);
});
