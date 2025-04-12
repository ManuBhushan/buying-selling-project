import axios from "axios";
import { useState } from "react";
import { DATABASE_URL } from "../config";
import { NotificationModel } from "./NotificationModel";
import { Spinner } from "./Spinner";
import { Trash2, CheckCircle, UploadCloud } from "lucide-react";

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
}

export const MyIndividualAds = ({
  ad,
  onDelete,
}: {
  ad: Ads;
  onDelete: (id: number) => void;
}) => {
  const [s, setS] = useState<boolean>(ad.sold);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${DATABASE_URL}/api/v1/ads/delete/${ad.id}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      setNotification({ message: "Ad deleted successfully!", type: "success" });
      onDelete(ad.id);
    } catch (error) {
      setNotification({ message: "Error while deleting Ad", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSold = async () => {
    setLoading(true);
    try {
      await axios.get(`${DATABASE_URL}/api/v1/ads/sold`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
        params: {
          id: ad.id,
          currentSold: s,
        },
      });
      setS((prev) => !prev);
      setNotification({
        message: s ? "Ad published successfully!" : "Ad marked as sold!",
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: "Error while updating Ad status",
        type: "error",
      });
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
      <div className="flex justify-center">
        <div
          className="w-full max-w-screen
-md px-6 py-6 border border-gray-300 dark:border-gray-700 rounded-xl mt-5 mb-5 bg-white dark:bg-gray-800 shadow-lg transition-all"
        >
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Created at: {new Date(ad.createdAt).toLocaleString()}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {ad.title.toUpperCase()}
          </div>
          <div className="mb-3 text-gray-700 dark:text-gray-300">
            <strong>Category:</strong> {ad.category}
          </div>
          <img
            src={`http://localhost:3000/${ad.imageLink.split("src/")[1]}`}
            alt="ad"
            className="w-full h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700 mb-4 bg-white"
          />
          <p className="text-base text-gray-800 dark:text-gray-300 mb-4">
            {ad.description}
          </p>
          <div className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">
            ₹ {ad.price}
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSold}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              {s ? (
                <>
                  <UploadCloud className="w-5 h-5" />
                  Publish Ad
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Mark as Sold
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition"
            >
              <Trash2 className="w-5 h-5" />
              Delete Ad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
