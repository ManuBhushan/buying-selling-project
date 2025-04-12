import axios from "axios";
import { useEffect, useState } from "react";
import { DATABASE_URL } from "../config";
import { MyIndividualAds } from "../components/MyIndividualAds";
import { Info } from "lucide-react";
import { Spinner } from "../components/Spinner";

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

export const MyAds = () => {
  const [myads, setMyAds] = useState<Ads[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAds = () => {
    setLoading(true);
    axios
      .get(`${DATABASE_URL}/api/v1/ads/own`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      })
      .then((res) => {
        setMyAds(res.data);
      })
      .catch((error) => {
        console.error("Error fetching ads:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const removeAdFromList = (id: number) => {
    setMyAds((prev) => prev.filter((ad) => ad.id !== id));
  };

  return (
    <div className="p-4 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {loading ? (
        <Spinner />
      ) : myads.length ? (
        myads.map((ad) => (
          <MyIndividualAds ad={ad} key={ad.id} onDelete={removeAdFromList} />
        ))
      ) : (
        <div className="max-w-md mx-auto mt-10 p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md flex items-start space-x-4">
          <Info className="h-6 w-6 text-blue-500 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              No Ads Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You don't have any running ads at the moment. Start posting to
              reach buyers!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
