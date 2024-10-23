import axios from "axios";
import { useEffect, useState } from "react";
import { DATABASE_URL } from "../config";
import { MyIndividualAds } from "../components/MyIndividualAds";

    interface Ads{
        category:string,
        description:string,
        id:number,
        imageLink:string,
        price:number,
        sold:boolean,
        title:string,
        userId:number,
        createdAt:Date
    }


export const MyAds = () => {
   
      const [myads,setMyAds]=useState<Ads[]>();
      useEffect(()=>{
            axios.get(`${DATABASE_URL}/api/v1/ads/own`,{
                headers:{
                    Authorization: localStorage.getItem("token") || ''
                }
            }).then(res=>{
                setMyAds(res.data);
            }).catch(error=>{
                console.log(error);
            })
      },[])
    return (
        <div >
        {myads?.length ? (
            myads.map((ad) => (
                
                   <MyIndividualAds ad={ad} key={ad?.id}/>            
            ))
        ) : (
            <p>You dont have any running ad</p>   
        )}
    </div>
    );
};
