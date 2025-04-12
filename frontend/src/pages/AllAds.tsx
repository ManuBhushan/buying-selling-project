import axios from "axios";
import { useEffect, useState } from "react";
import { DATABASE_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { validUser } from "../hooks/CustomAds";
import { NotificationModel } from "../components/NotificationModel";
import { Heart, Loader2, Tag, DollarSign, Info } from "lucide-react";
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
  liked: boolean;
}

export const AllAds = () => {
  const [allads, setAllAds] = useState<Ads[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const login = useRecoilValue(validUser).isValid;
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  const handleLikeSubmit = async (id: number) => {
    if (!login) {
      navigate("/signin");
      return;
    }

    setActionLoading(id);
    try {
      await axios.get(`${DATABASE_URL}/api/v1/like/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });

      setAllAds((ads) =>
        ads?.map((ad) => (ad.id === id ? { ...ad, liked: true } : ad)),
      );

      setNotification({ message: "Item added to favorites!", type: "success" });
    } catch (error) {
      navigate("/signin");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlikeSubmit = async (id: number) => {
    if (!login) {
      navigate("/signin");
      return;
    }

    setActionLoading(id);
    try {
      await axios.delete(`${DATABASE_URL}/api/v1/unlike/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });

      setAllAds((ads) =>
        ads?.map((ad) => (ad.id === id ? { ...ad, liked: false } : ad)),
      );

      setNotification({
        message: "Item removed from favorites",
        type: "success",
      });
    } catch (error) {
      navigate("/signin");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    setLoading(true);

    const fetchAds = async () => {
      try {
        let res;
        if (login) {
          res = await axios.get(`${DATABASE_URL}/api/v1/ads/bulk/withlike`, {
            headers: {
              Authorization: localStorage.getItem("token") || "",
            },
          });
        } else {
          res = await axios.get(`${DATABASE_URL}/api/v1/ads/bulk`);
        }
        setAllAds(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [login]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spinner />
      </div>
    );
  }

  if (!allads?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500 dark:text-gray-400">
        <Info size={48} className="mb-4 text-gray-400" />
        <h3 className="text-xl font-medium mb-2">No listings found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <>
      {notification && (
        <NotificationModel
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg dark:shadow-black/30 transition-shadow duration-300"
          >
            <div className="relative">
              <Link to={`/ad/${ad.id}`}>
                <img
                  src={`http://localhost:3000/${ad.imageLink.split("src/")[1]}`}
                  alt={ad.title}
                  className="w-full h-48 object-cover"
                />
                {ad.sold && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white py-1 px-3 text-xs font-bold">
                    SOLD
                  </div>
                )}
              </Link>

              <button
                onClick={
                  !ad.liked
                    ? () => handleLikeSubmit(ad.id)
                    : () => handleUnlikeSubmit(ad.id)
                }
                className={`absolute top-2 left-2 p-2 rounded-full shadow hover:scale-110 transition-all 
                  ${
                    ad.liked
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-600 dark:bg-zinc-800 dark:text-white"
                  }`}
              >
                {actionLoading === ad.id ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Heart size={20} className={ad.liked ? "fill-white" : ""} />
                )}
              </button>
            </div>

            <div className="p-4">
              <Link to={`/ad/${ad.id}`}>
                <h3 className="font-semibold text-lg leading-tight truncate mb-1 dark:text-white">
                  {ad.title}
                </h3>

                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 mb-2">
                  <Tag size={16} />
                  <span className="text-sm">{ad.category}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                  {ad.description}
                </p>

                <div className="flex items-center text-lg font-bold text-gray-   dark:text-white">
                  <DollarSign size={18} />
                  <span>{ad.price.toLocaleString()}</span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
