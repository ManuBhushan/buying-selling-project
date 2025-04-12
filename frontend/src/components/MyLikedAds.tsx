import { useState } from "react";
import { DATABASE_URL } from "../config";
import axios from "axios";
import { NotificationModel } from "./NotificationModel";
import { Spinner } from "./Spinner";

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
  liked: boolean;
}

interface MyIndividualAdsProps {
  ad: Ads;
  id: number;
}

export const MyLikedAds = ({
  adItem,
  onUnlike,
}: {
  adItem: MyIndividualAdsProps;
  onUnlike: (id: number) => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handelUnlike = async () => {
    setLoading(true);
    try {
      await axios.delete(`${DATABASE_URL}/api/v1/ads/unlike/${adItem.ad.id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setNotification({ message: "Ad unliked successfully!", type: "success" });

      // Remove ad from list in parent
      onUnlike(adItem.ad.id);
    } catch (error: any) {
      console.log(error.message);
      setNotification({ message: "Error while unliking Ad", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Spinner />}
      {notification && (
        <NotificationModel
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex justify-center px-4">
        <div
          className="w-full max-w-4xl border dark:border-gray-700 rounded-2xl shadow-md 
          p-6 mb-6 bg-white dark:bg-gray-800 transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={`http://localhost:3000/${adItem.ad.imageLink.split("src/")[1]}`}
              alt="ad"
              className="w-full md:w-72 h-52 object-contain bg-white border rounded-lg dark:bg-gray-900"
            />
            <div className="flex flex-col flex-1">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Created at: {new Date(adItem.ad.createdAt).toLocaleString()}
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                Category:{" "}
                <span className="uppercase">{adItem.ad.category}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {adItem.ad.title.toUpperCase()}
              </div>
              <div className="text-gray-700 dark:text-gray-300 mb-4">
                {adItem.ad.description}
              </div>
              <div className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">
                ₹ {adItem.ad.price}
              </div>
              <button
                onClick={handelUnlike}
                className="self-start text-white bg-red-600 hover:bg-red-700 focus:ring-4 
                focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-full text-sm px-5 py-2.5"
              >
                Unlike Ad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
