import { useRecoilValue } from "recoil";
import { validUser } from "../hooks/CustomAds";
import { useEffect, useState } from "react";
import axios from "axios";
import { DATABASE_URL } from "../config";
import { Link } from "react-router-dom";
import { IoMdChatboxes } from "react-icons/io";
import { Spinner } from "../components/Spinner";

interface Sender {
  name: string;
}

interface Ad {
  title: string | null;
  price: number;
  sold: boolean;
  userId: number;
  user: Sender;
}

interface AdOverview {
  ad: Ad;
  adId: number;
}

function Chat() {
  const userId = useRecoilValue(validUser).userId;
  const [chat, setChat] = useState<AdOverview[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(
          `${DATABASE_URL}/api/v2/message/${userId}`,
          {
            headers: {
              Authorization: localStorage.getItem("token") || "",
            },
          },
        );
        setChat(res.data);
      } catch (error) {
        console.error("Error fetching chats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 px-4 py-6">
      <h2 className="text-2xl font-semibold text-center text-blue-600 dark:text-blue-400 mb-6">
        All Your Chats
      </h2>

      {loading ? (
        <Spinner />
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {chat?.length ? (
            chat.map((ch) => (
              <div
                key={ch.adId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-blue-300 dark:border-blue-700 rounded-lg shadow-md bg-blue-50 dark:bg-zinc-800 transition-all"
              >
                <Link
                  to={`/ad/${ch.adId}`}
                  className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-white flex-grow"
                >
                  <div>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Name:
                    </span>{" "}
                    {ch.ad.user.name}
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Title:
                    </span>{" "}
                    {ch.ad.title || "No title given"}
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Price:
                    </span>{" "}
                    ₹{ch.ad.price}
                  </div>
                </Link>

                <Link
                  to={`/chat/${ch.adId}`}
                  state={{
                    title: ch.ad.title,
                    price: ch.ad.price,
                    ownerId: ch.ad.userId,
                    senderName: ch.ad.user.name,
                  }}
                  className="text-blue-600 dark:text-blue-300 hover:scale-110 transition-transform"
                >
                  <IoMdChatboxes size={28} />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              No chats found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Chat;
