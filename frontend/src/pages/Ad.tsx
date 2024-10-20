import { useEffect, useState } from "react"
import { IndividualAd } from "../components/IndividualAd"
import { useParams } from "react-router-dom";
import axios from "axios";
import { DATABASE_URL } from "../config";

interface User{
  name:String
}
  interface Ads{
    category:string,
    description:string,
    id:number,
    imageLink:string,
    price:number,
    sold:boolean,
    title:string,
    userId:number,
    createdAt:Date,
    user:User
  }
export const Ad=()=>{


  const {id} = useParams()
 const [indiAd,setIndiAd]=useState<Ads>();
  useEffect(()=>{
      axios.get(`${DATABASE_URL}/api/v1/ads/ad/${id}`).then((response)=>{
        setIndiAd(response.data);
      }).catch((error)=>{
        console.log(error);
      })
  },[])

  return (
    <div>
        
        <IndividualAd ad={indiAd} />
    </div>

  )
}
