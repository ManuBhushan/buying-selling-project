import { FormEvent, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { DATABASE_URL } from "../config";
import { useRecoilValue } from "recoil";
import { validUser } from "../hooks/CustomAds";
import { Socket } from "socket.io-client";
import { Spinner } from "../components/Spinner";

interface Conversation {
  senderId: number;
  message: string;
  id: number;
}

function ChatInd({ socket }: { socket: Socket | null }) {
  const location = useLocation();
  const { id } = useParams(); // adId
  const { price, ownerId, senderName } = location.state || {};
  let { title } = location.state;
  if (!title) title = "No title given";
  const navigate = useNavigate();
  const user = useRecoilValue(validUser);
  const login = user.isValid;
  const userId = user.userId;
  const userName = user.userName;
  const [message, setMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${DATABASE_URL}/api/v2/message/indiMessages`,
          {
            params: {
              receiverId: ownerId,
              senderId: userId,
              adId: Number(id),
            },
            headers: {
              Authorization: localStorage.getItem("token") || "",
            },
          },
        );
        setAllMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [ownerId, userId, id]);

  useEffect(() => {
    if (socket) {
      const handleMessage = (data: Conversation) => {
        const newMessage: Conversation = {
          senderId: data.senderId,
          message: data.message,
          id: Date.now(),
        };
        setAllMessages((prev) => [...prev, newMessage]);
      };

      socket.on("private-message", handleMessage);
      return () => {
        socket.off("private-message", handleMessage);
      };
    }
  }, [socket]);

  const sendPrivateMessage = async ({
    message,
    receiverId,
    senderId,
    adId,
  }: {
    message: string;
    receiverId: number;
    senderId: number;
    adId: number;
  }) => {
    if (!socket) return console.log("Socket not connected");
    try {
      await axios.post(
        `${DATABASE_URL}/api/v2/message/createChat`,
        { message, receiverId, senderId, adId },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        },
      );
      socket.emit("private-message", {
        message,
        receiverId,
        adId,
        senderId,
        senderName: userName,
        title,
      });
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!login) return navigate("/signin");

    if (ownerId === userId) {
      alert("You cannot send message to yourself");
      return;
    }

    const newMessage: Conversation = {
      senderId: userId,
      message,
      id: Date.now(),
    };

    setAllMessages((prev) => [...prev, newMessage]);
    sendPrivateMessage({
      message,
      receiverId: ownerId,
      senderId: userId,
      adId: Number(id),
    });
    setMessage("");
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-zinc-900 text-white overflow-hidden">
      {/* Chat Header - Fixed at top */}
      <div className="bg-zinc-800 px-5 py-3 flex justify-between items-center border-b border-zinc-700 shadow-md">
        <div className="text-lg font-semibold">{senderName}</div>
        <div className="text-base text-zinc-400 truncate max-w-xs">{title}</div>
        <div className="text-sm text-green-400">₹{price}</div>
      </div>

      {/* Messages - Scrollable container with fixed height */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-zinc-900">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : allMessages.length > 0 ? (
          allMessages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[70%] px-4 py-2 rounded-xl ${
                m.senderId === userId
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-zinc-700 text-white"
              }`}
            >
              {m.message}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <div className="bg-zinc-800 p-4 rounded-xl flex flex-col items-center shadow-md border border-zinc-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-zinc-500 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4.248-.948l-4.126.842.842-4.126A8.964 8.964 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg font-semibold mb-1">Start a conversation</p>
              <p className="text-sm text-zinc-500 text-center">
                Your messages will appear here. Say hello to get things started!
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed at bottom */}
      <div className="bg-zinc-800 px-3 py-3 border-t border-zinc-700">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 bg-zinc-700 text-white placeholder-zinc-400 px-4 py-2 rounded-full outline-none"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 transition text-blue-500 disabled:opacity-50 disabled:hover:bg-zinc-700"
          >
            <Send size={22} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatInd;
