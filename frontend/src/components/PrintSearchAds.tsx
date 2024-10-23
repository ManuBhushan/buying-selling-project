import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { customAds, validUser } from "../hooks/CustomAds";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { NotificationModel } from "./NotificationModel";
import { useState } from "react";
import axios from "axios";
import { DATABASE_URL } from "../config";
import { Spinner } from "./Spinner";

export const PrintSearchAds= () => {
    // const location = useLocation();
        const ads=useRecoilValue(customAds);
        const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
        const [loading, setLoading] = useState<boolean>(false);
        const login=useRecoilValue(validUser).isValid;
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
                setLoading(false);
            } catch (error) {
                navigate('/signin');
    
            }finally{
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
    // const queryParams = new URLSearchParams(location.search);
    // // const category = queryParams.get('category');
    
    // // console.log("x",ads);
    // // console.log(category);
 
    return (
        <>
        <div className="p-4 grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
                {loading && <Spinner />}
                {notification && (
                    <NotificationModel
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}

                {
                    ads?.length ? (
                        ads.map((ad) => (
                            
                        <div key={ad.id} className="relative">
                           
                            <div className="block bg-gray-400 p-6 min-h-[350px] max-h-[400px] min-w-[250px] rounded shadow mx-auto border-4">
                               
                                {
                                login ? (
                                    <button
                                        
                                        onClick={!ad.liked ? () => handelLikeSubmit(ad.id) : () => handelUnlikeSubmit(ad.id)}
                                    >
                                        {ad.liked ? (<MdFavorite size={20}/>) : (<MdFavoriteBorder size={20}/>)}
                                    </button>
                                ) : (
                                    <button
                                        
                                        onClick={() => handelLikeSubmit(ad.id)}
                                    >
                                        <MdFavoriteBorder size={20}/>
                                    </button>
                                )
                                }

                            <Link to={`/ad/${ad.id}` }
                                key={ad.id} 
                                >   
                                <img src={`http://localhost:3000/${ad.imageLink.split('src/')[1]}`} alt="image"
                                className="min-h-[200px] max-h-[200px] object-cover mx-auto"  />

                                <p ><strong>Title:</strong> {ad.title}</p>
                                <p><strong>Description:</strong> {ad.description?.length > 15 ? ad.description.slice(0, 15) + '...' : ad.description}</p>
                                <p><strong>Price:</strong> {ad.price}</p>
                                <p><strong>Category:</strong> {ad.category}</p>
                             </Link>  

                            
                        </div>



                        </div>
                    ))
                ) :
                (
                    <p>No Ads available right now</p>
                )
            }
        </div>
        </>
    );
};

