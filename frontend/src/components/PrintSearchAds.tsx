import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { customAds } from "../hooks/CustomAds";

export const PrintSearchAds= () => {
    const location = useLocation();
        const ads=useRecoilValue(customAds);

    const queryParams = new URLSearchParams(location.search);
    // const category = queryParams.get('category');
    
    // console.log("x",ads);
    // console.log(category);
    return (
    <>
    
     <div className="p-4 grid grid-cols-4 gap-4">
        {ads?.length ? (
            ads.map((ad) => (
                
                    <div 
                        key={ad.id} 
                        className="bg-gray-400 p-6 min-h-[350px] max-h-[400px] rounded shadow w-auto mx-auto"
                    >   
                        <img src={`http://localhost:3000/${ad.imageLink.split('src/')[1]}`} alt="image" />

                        <p><strong>Title:</strong> {ad.title}</p>
                        <p><strong>Description:</strong> {ad.description}</p>
                        <p><strong>Price:</strong> {ad.price}</p>
                        <p><strong>Category:</strong> {ad.category}</p>
                    </div>             
            ))
        ) : (
            <p>No Ads available right now</p>
        )}
    </div>
    </>
       
    );
};

