import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoMdChatboxes } from "react-icons/io";
import { validUser } from "../hooks/CustomAds";
import { DATABASE_URL } from "../config";
import { Spinner } from "../components/Spinner";

interface Ad {
  title: string | null;
  price: number;
  id: number;
}

interface Sender {
  name: string;
  id: number;
}

interface QueryOverview {
  ad: Ad;
  sender: Sender;
}

function QueryChat() {
  const userId = useRecoilValue(validUser).userId;
  const [chat, setChat] = useState<QueryOverview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await axios.get(
          `${DATABASE_URL}/api/v2/message/saleQuery`,
          {
            params: { ownerId: userId },
            headers: {
              Authorization: localStorage.getItem("token") || "",
            },
          },
        );
        setChat(res.data);
      } catch (error) {
        console.error("Error fetching query chats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [userId]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 px-4 py-6">
      <h2 className="text-2xl font-semibold text-center text-blue-600 dark:text-blue-400 mb-6">
        All Queries
      </h2>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {chat?.length ? (
            chat.map((ch) => (
              <div
                key={ch.ad.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-blue-300 dark:border-blue-700 rounded-lg shadow-md bg-blue-50 dark:bg-zinc-800 transition-all"
              >
                <Link
                  to={`/ad/${ch.ad.id}`}
                  className="flex flex-col gap-1 text-sm text-zinc-800 dark:text-white flex-grow"
                >
                  <div>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Name:
                    </span>{" "}
                    {ch.sender.name}
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
                  to={`/chat/${ch.ad.id}`}
                  state={{
                    title: ch.ad.title,
                    price: ch.ad.price,
                    ownerId: ch.sender.id,
                    senderName: ch.sender.name,
                  }}
                  className="text-blue-600 dark:text-blue-300 hover:scale-110 transition-transform"
                >
                  <IoMdChatboxes size={28} />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              No queries found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default QueryChat;
