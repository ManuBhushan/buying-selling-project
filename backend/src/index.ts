import express from "express";
import userRouter from "./routes/userRouter";
import cors from "cors";
import adsRouter from "./routes/adsRouter";
import likeRouter from "./routes/likeRouter";
import messageRouter from "./routes/messageRouter";
import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const map = new Map<string, string>();

// ✅ ENV
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL as string;

// ✅ Middlewares
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

// ✅ HTTP + SOCKET
const httpserver = createServer(app);

const io = new Server(httpserver, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

// ✅ DB TEST
async function testDB() {
  try {
    await prisma.$connect();
    console.log("✅ DB Connected");
  } catch (err) {
    console.error("❌ DB Connection Failed", err);
  }
}
testDB();

// ✅ SOCKET LOGIC (FIXED)
io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;

  if (!userId) {
    console.log("❌ Invalid user, disconnecting");
    socket.disconnect();
    return;
  }

  map.set(userId, socket.id);
  console.log("✅ Socket connected:", socket.id, "User:", userId);

  socket.on("private-message", (data) => {
    const { message, receiverId, adId } = data;

    const receiverSocketId = map.get(String(receiverId));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("private-message", {
        message,
        adId,
        senderId: userId,
      });
    }
  });

  socket.on("disconnect", () => {
    map.delete(userId);
    console.log("❌ Disconnected:", userId);
  });
});

// ✅ Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/ads", adsRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v2/message", messageRouter);

// ❌ REMOVE THIS IN PRODUCTION IF USING CLOUDINARY
// app.use("/uploads", express.static(path.join(projectRoot, config.UPLOADS_DIR)));

httpserver.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
