import axios from "axios";
import { useEffect, useState } from "react";
import { DATABASE_URL } from "../config";
import { MyLikedAds } from "../components/MyLikedAds";

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

export const LikedAds = () => {
  const [likedAds, setLikedAds] = useState<MyIndividualAdsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(`${DATABASE_URL}/api/v1/like/liked`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      })
      .then((res) => {
        setLikedAds(res.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const removeAdFromList = (id: number) => {
    setLikedAds((prev) => prev.filter((item) => item.ad.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Your Liked Ads
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      ) : likedAds.length ? (
        <div className="grid grid-cols-1 gap-6">
          {likedAds.map((adItem) => (
            <MyLikedAds
              adItem={adItem}
              key={adItem.id}
              onUnlike={removeAdFromList}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          You don’t have any liked ads yet.
        </p>
      )}
    </div>
  );
};
