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
  liked:boolean;
}

interface MyIndividualAdsProps {

    ad: Ads;
    id:number

    }   


export const MyLikedAds = ({ adItem }:{adItem:MyIndividualAdsProps}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);


  const handelUnlike = async () => {

    setLoading(true);
    try {
        console.log(adItem.id);
      await axios.delete(`${DATABASE_URL}/api/v1/unlike/${adItem.ad.id}`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      setNotification({ message: 'Ad unliked successfully!', type: 'success' });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setNotification({ message: 'Error while unliking Ad', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
         {loading && <Spinner/>}
      {notification && (
        <NotificationModel
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
     
      <div className="flex justify-center">
        <div className="w-full max-w-screen-xl px-4 pt-2 pb-10 border-2 rounded-lg mt-5 mb-5 bg-slate-200 overflow-hidden">
          <div className="flex items-center mb-4">
            <div>
              <div className="text-slate-500 pt-2">
                Created at: {adItem.ad?.createdAt.toLocaleString()}
              </div>
              <div className="text-xl font-bold">
                Category: {adItem.ad?.category?.toUpperCase()}
              </div>
              <img
                src={`http://localhost:3000/${adItem.ad?.imageLink.split('src/')[1]}`}
                alt="image"
                className="max-w-full h-auto max-h-80 object-contain"
              />
            </div>
          </div>
          <div className="text-4xl font-extrabold pt-4">
            Title: {adItem.ad?.title?.toUpperCase()}
          </div>
          <div className="text-xl font-md pt-2">
            {adItem.ad?.description?.toLowerCase()}
          </div>
          <div className="pt-4 break-words text-2xl font-bold">
            Price: {adItem.ad?.price}
          </div>

          <div>
            <button
              onClick={handelUnlike}
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4
              focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mb-2 mr-5"
            >
              Unlike Ad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
