import axios from "axios"
import { DATABASE_URL } from "../config"
import { useState } from "react"

interface Ads{
    category:string,
    description:string,
    id:number,
    imageLink:string,
    price:number,
    sold:boolean,
    title:string,
    userId: number,
    createdAt:Date
  }
 export const   MyIndividualAds=({ad}:{ad:Ads | undefined})=> {
    const [s,setS]=useState<boolean>( ad?.sold|| false);
    
    const handelSold=async()=>{
        try{
                const updatedAd=await axios.get(`${DATABASE_URL}/api/v1/ads/sold`,{
                    headers:{
                        Authorization: localStorage.getItem("token") || ''
                    },params:{
                        id: ad?.id,
                        currentSold:s
                    }
                })
                setS((c)=>!c);
                
               
                console.log(updatedAd);
        }
        catch(error){
            alert("Error");
        }
    }

return (

        <div>

<div className="flex justify-center">
                <div className="w-full max-w-screen-xl px-4 pt-2 pb-10 border-2 rounded-lg mt-5 mb-5 bg-slate-200 overflow-hidden">
                   
                    <div className="flex items-center mb-4">
                       
                        <div>
                        <div className="text-slate-500 pt-2">
                        Created at:{ad?.createdAt}
                    </div>
                        <div className="text-xl font-bold">
                                Category: {ad?.category.toUpperCase()}
                            </div>
                          <img src={`http://localhost:3000/${ad?.imageLink.split('src/')[1]}`} alt="image"  className="max-w-full h-auto max-h-80 object-contain"/>                            
                        </div>
                    </div>
                    
                    <div className="text-4xl font-extrabold pt-4">
                        Title: {ad?.title.toUpperCase()}
                    </div>
                    <div className="text-xl font-md pt-2">
                       {ad?.description.toLowerCase()}
                    </div>
                    <div className="pt-4 break-words text-2xl font-bold ">
                      Price: {ad?.price}
                    </div>
                   {s ?(
                    <div>
                         <button  onClick={handelSold} className=" text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 
                                focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mb-2 mr-5">Mark as Unsold</button>
                    </div>
                        ):
                    (
                    <div>
                         <button onClick={handelSold} className=" text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 
                            focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mb-2 mr-5">Mark as Sold</button>
                    </div>
                   )}
                    </div>

            </div>




        </div>
)

}
