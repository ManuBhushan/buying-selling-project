import { Link } from "react-router-dom";
import { IoMdChatboxes } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { validUser } from "../hooks/CustomAds";

interface User {
  name: string;
}

interface Ads {
  category: string;
  description: string;
  id: number;
  imageLink: string;
  price: number;
  sold: boolean;
  title: string;
  userId: number;
  createdAt: Date;
  user: User;
}

export const IndividualAd = ({ ad }: { ad: Ads | undefined }) => {
  const userId = useRecoilValue(validUser).userId;

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="w-full max-w-4xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border rounded-2xl shadow-lg overflow-hidden p-6 space-y-6 transition-colors duration-300">
        {/* Created At */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Created at:{" "}
          {ad?.createdAt ? new Date(ad.createdAt).toLocaleString() : "N/A"}
        </div>

        {/* Category */}
        <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
          Category: {ad?.category ?? "N/A"}
        </div>

        {/* Image */}
        {ad?.imageLink && (
          <img
            src={`http://localhost:3000/${ad.imageLink.split("src/")[1]}`}
            alt="Ad Image"
            className="w-full max-h-[400px] object-contain rounded-md border dark:border-gray-700"
          />
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight">
          {ad?.title?.toUpperCase() ?? "No Title"}
        </h1>

        {/* Description */}
        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
          {ad?.description ?? "No description provided."}
        </p>

        {/* Price */}
        <div className="text-2xl font-semibold text-green-600 dark:text-green-400">
          Price: ₹{ad?.price}
        </div>

        {/* Chat Button */}
        {ad?.userId !== userId && (
          <div className="flex justify-end pt-4">
            <Link
              to={`/chat/${ad?.id}`}
              state={{
                title: ad?.title,
                price: ad?.price,
                ownerId: ad?.userId,
                senderName: ad?.user.name,
              }}
              className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
              title="Chat with Seller"
            >
              <IoMdChatboxes size={36} />
              <span className="text-lg font-medium">Chat</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
