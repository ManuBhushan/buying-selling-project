import { PrismaClient } from "@prisma/client";
import express, { Response,Request } from "express";
import { checkUser } from "../middlewares/userAuth";
import { getAllUserLikedAds, likeAd } from "../controllers/adController";

const likeRouter=express();

const prisma=new PrismaClient();

interface CustomRequest extends Request {
    userId?: { id: number };
  }


likeRouter.use("/",checkUser);

likeRouter.get("/liked",getAllUserLikedAds);

likeRouter.get("/check/:id",async (req:CustomRequest,res:Response)=>{

    try{
        const userId=req.userId?.id;
        const adId=req.params.id;
        const likedads=await prisma.like.findFirst({
            where:{
                userId:userId,
                adId:Number(adId)
            }
        })
        // console.log(likedads);
        if(!likedads)return res.send("false")
       
        return res.send("true");
    }
    catch(error){
        return res.status(411).send("Error while fetching liked ads");
    }   


})


likeRouter.get("/:id",likeAd);


export default likeRouter