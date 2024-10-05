import axios from "axios";
import { useEffect, useState } from "react";
import { DATABASE_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { validUser } from "../hooks/CustomAds";
import { NotificationModel } from "../components/NotificationModel";

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

const Spinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="border-t-4 border-b-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
    </div>
  );
  
export const AllAds = () => {
    const [allads, setAllAds] = useState<Ads[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const login=useRecoilValue(validUser);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const navigate=useNavigate();

      const handelLikeSubmit= async (id:number)=>{
        if(!login){
                navigate("/signin")
        }
        setLoading(true);
        try {
            const res=await axios.get(`${DATABASE_URL}/api/v1/like/${id}`, { 
                headers: {
                    Authorization: localStorage.getItem("token") || ""
                  }
                });
            setNotification({ message: 'Ad Liked Successfully!', type: 'success' });
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {

            navigate('/signin');

        }finally{
            setLoading(false);


        }
    };
    const handelUnlikeSubmit = async (id:number)=>{
       
        if(!login){
            navigate("/signin")
    }
    setLoading(true);
    try {
        const res=await axios.delete(`${DATABASE_URL}/api/v1/unlike/${id}`, { 
            headers: {
                Authorization: localStorage.getItem("token") || ""
              }
            });
        setNotification({ message: 'Ad Unliked Successfully!', type: 'success' });
        setTimeout(() => window.location.reload(), 2000);
    } catch (error) {

        navigate('/signin');

    }finally{
        setLoading(false);


    }

    };
    
    useEffect(() => {
        if(login){
            axios.get(`${DATABASE_URL}/api/v1/ads/bulk/withlike`,{
                headers:{
                    Authorization: localStorage.getItem("token") || ""
                }
            })
                .then(res => {
                    console.log(res.data);
                    setAllAds(res.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        else{
            axios.get(`${DATABASE_URL}/api/v1/ads/bulk`)
                .then(res => {
                    console.log(res.data);
                    setAllAds(res.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        
    }, []);

    return (
    
        <div className="p-4 grid grid-cols-4 gap-4">
            {loading && <Spinner/>}
            {notification && (
        <NotificationModel
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
            {allads?.length ? (
                allads.map((ad) => (
                    <div key={ad.id} className="relative">
                        <Link to={`/ad/${ad.id}`}
                            className="block bg-gray-400 p-6 min-h-[350px] max-h-[400px] w-[300px] rounded shadow mx-auto border-4">
                            <img src={`http://localhost:3000/${ad.imageLink.split('src/')[1]}`} alt="image"
                                className="min-h-[200px] max-h-[200px] min-w-[250px] max-w-[200px] object-cover mx-auto" />
                            <p><strong>Title:</strong> {ad.title}</p>
                            <p><strong>Description:</strong> {ad.description.length > 15 ? ad.description.slice(0, 15) + '...' : ad.description}</p>
                            <p><strong>Price:</strong> {ad.price}</p>
                            <p><strong>Category:</strong> {ad.category}</p>
                        </Link>
                        {
                            login ?
                             ( <button 
                        className="absolute top-1 right-1.5 bg-red-500 text-white 
                                    w-8 h-8 rounded-full flex items-center justify-center"
                        onClick={ !(ad.liked) ? () => handelLikeSubmit(ad.id): ()=>handelUnlikeSubmit(ad.id)}
                        >
                        { ad.liked ? (<span className="text-lg">U</span>) : (<span className="text-lg">L</span>)}

                         </button> )
                        :
                        (<></>)
                    } 

                        
                      


                    </div>
                ))
            ) : (
                <p>No Ads available right now</p>
            )}
        </div>
    );
};
