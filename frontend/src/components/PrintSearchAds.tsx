import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { customAds, validUser } from "../hooks/CustomAds";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { NotificationModel } from "./NotificationModel";
import { useState } from "react";
import axios from "axios";
import { DATABASE_URL } from "../config";
import { Spinner } from "./Spinner";

export const PrintSearchAds = () => {
  // const location = useLocation();
  const [ads, setAds] = useRecoilState(customAds);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const login = useRecoilValue(validUser).isValid;
  const navigate = useNavigate();

  const handelLikeSubmit = async (id: number) => {
    if (!login) {
      navigate("/signin");
    }
    setLoading(true);
    try {
      await axios.get(`${DATABASE_URL}/api/v1/like/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });

      setAds((ads) =>
        ads?.map((ad) => (ad.id === id ? { ...ad, liked: true } : ad)),
      );
      setNotification({ message: "Ad Liked Successfully!", type: "success" });
    } catch (error) {
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  const handelUnlikeSubmit = async (id: number) => {
    if (!login) {
      navigate("/signin");
    }

    setLoading(true);
    try {
      await axios.delete(`${DATABASE_URL}/api/v1/unlike/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      setNotification({ message: "Ad Unliked Successfully!", type: "success" });
      setAds((ads) =>
        ads?.map((ad) => (ad.id === id ? { ...ad, liked: false } : ad)),
      );
    } catch (error) {
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };
  // const queryParams = new URLSearchParams(location.search);
  // // const category = queryParams.get('category');

  // // console.log("x",ads);
  // // console.log(category);

  return (
    <div
      className="p-4 grid gap-6"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}
    >
      {loading && <Spinner />}
      {notification && (
        <NotificationModel
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {ads?.length ? (
        ads.map((ad) => (
          <div key={ad.id} className="relative">
            <div className="block bg-gray-100 dark:bg-gray-800 p-6 min-h-[350px] max-h-[400px] min-w-[250px] rounded-2xl shadow-lg border-2 border-gray-300 dark:border-gray-600 mx-auto transition-all hover:scale-105 duration-200">
              <div className="flex justify-end">
                {login ? (
                  <button
                    onClick={
                      !ad.liked
                        ? () => handelLikeSubmit(ad.id)
                        : () => handelUnlikeSubmit(ad.id)
                    }
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {ad.liked ? (
                      <MdFavorite size={22} />
                    ) : (
                      <MdFavoriteBorder size={22} />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handelLikeSubmit(ad.id)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <MdFavoriteBorder size={22} />
                  </button>
                )}
              </div>

              <Link to={`/ad/${ad.id}`}>
                <img
                  src={`http://localhost:3000/${ad.imageLink.split("src/")[1]}`}
                  alt="ad"
                  className="min-h-[200px] max-h-[200px] object-contain mx-auto rounded-md my-2"
                />
                <div className="text-gray-900 dark:text-gray-100 space-y-1">
                  <p>
                    <strong>Title:</strong> {ad.title}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {ad.description?.length > 15
                      ? ad.description.slice(0, 15) + "..."
                      : ad.description}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{ad.price}
                  </p>
                  <p>
                    <strong>Category:</strong> {ad.category}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-700 dark:text-gray-300">
          No Ads available right now
        </p>
      )}
    </div>
  );
};
