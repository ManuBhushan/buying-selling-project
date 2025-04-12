import { io } from "socket.io-client";
import { DATABASE_URL } from "../config";

// Create a function to initialize the socket with user info
export const SocketConnection = (user: {
  isValid: boolean;
  userId: number | null;
}) => {
  if (!user.isValid || !user.userId) {
    console.log("User is not valid, socket connection not established");
    return null;
  }

  // Pass the userId as a query parameter during socket connection
  const socket = io(DATABASE_URL, {
    query: { userId: user.userId.toString() },
  });

  socket.on("connect", () => {
    console.log("Connected to WebSocket :", socket.id);
  });

  return socket;
};
