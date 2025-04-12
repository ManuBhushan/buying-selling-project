import { useEffect, useState } from "react";
import { IndividualAd } from "../components/IndividualAd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DATABASE_URL } from "../config";
import { AlertTriangle } from "lucide-react";
import { Spinner } from "../components/Spinner";

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

export const Ad = () => {
  const { id } = useParams();
  const [indiAd, setIndiAd] = useState<Ads | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`${DATABASE_URL}/api/v1/ads/ad/${id}`)
      .then((response) => {
        setIndiAd(response.data);
        setError(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="p-4 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <p className="text-lg font-semibold">Failed to load the ad.</p>
          <p className="text-gray-600 dark:text-gray-400">
            Please check the URL or try again later.
          </p>
        </div>
      ) : indiAd ? (
        <IndividualAd ad={indiAd} />
      ) : (
        <div className="text-center mt-10 text-gray-600 dark:text-gray-400">
          No ad found with the given ID.
        </div>
      )}
    </div>
  );
};
