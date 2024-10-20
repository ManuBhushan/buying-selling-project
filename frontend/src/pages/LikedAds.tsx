import axios from "axios";
import { useEffect, useState } from "react";
import { DATABASE_URL } from "../config";
import { MyLikedAds } from "../components/MyLikedAds";

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

interface MyIndividualAdsProps {

    ad: Ads;
    id:number

    }   


export const LikedAds = () => {
   
      const [likedads,setLikedAds]=useState<MyIndividualAdsProps[]>();
      useEffect(()=>{
            axios.get(`${DATABASE_URL}/api/v1/like/liked`,{
                headers:{
                    Authorization: localStorage.getItem("token") || ''
                }
            }).then(res=>{
                setLikedAds(res.data);
            }).catch(error=>{
                console.log(error);
            })
      },[])
    return (
        <div >
        {likedads?.length ? (
            likedads.map((adItem) => (
                
                   <MyLikedAds adItem={adItem} key={adItem.id}/>            
            ))
        ) : (
            <p>You dont have any running ad</p>   
        )}
    </div>
    );
};
