import axios from "axios";
import { useEffect, useState } from "react";
import { DATABASE_URL } from "../config";

    interface Ads{
        category:string,
        description:string,
        id:number,
        imageLink:string,
        price:number,
        sold:boolean,
        title:string,
        userId:number
    }


export const AllAds = () => {
   
      const [allads,setAllAds]=useState<Ads[]>();
      useEffect(()=>{
            axios.get(`${DATABASE_URL}/api/v1/ads/bulk`).then(res=>{
                setAllAds(res.data);
            }).catch(error=>{
                console.log(error);
            })
      },[])
    return (
        <div className="p-4 grid grid-cols-4 gap-4">
        {allads?.length ? (
            allads.map((ad) => (
                
                    <div 
                        key={ad.id} 
                        className="bg-gray-400 p-6 min-h-[350px] max-h-[400px] rounded shadow w-auto mx-auto"
                    >   
                        <img src={`http://localhost:3000/${ad.imageLink.split('src/')[1]}`} alt="image" />

                        <p><strong>Title:</strong> {ad.title}</p>
                        <p><strong>Price:</strong> {ad.price}</p>
                        <p><strong>Category:</strong> {ad.category}</p>
                    </div>             
            ))
        ) : (
            <p>No Ads available right now</p>
        )}
    </div>
    );
};
