import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Response,Request } from "express";
import jwt from "jsonwebtoken"

import { config } from '../config';

const likeRouter=express();


const prisma=new PrismaClient();

interface CustomRequest extends Request {
    userId?: { id: number };
  }


likeRouter.use("/",(req: CustomRequest, res: Response, next: NextFunction)=>{
    try{
    
    const header=req.header("Authorization") || "";

        const user=jwt.verify(header,config.JWT_SECRET) as { id: number };
        if(!user){
                return res.status(409).send("Invalid user");
        }
        else{       
            const id:number=user.id;

            const userId={id};
            req.userId=userId;  
            next();
            }
    }
    catch(e){
        return res.status(411).send("Wrong user");

    }
})


likeRouter.post("/:id",async (req:CustomRequest,res:Response)=>{
    try {
        const userId =req.userId?.id;
        const adId=req.params.id;
        console.log(adId);
        
        const ad=await prisma.like.create({
            data:{
                userId:userId || 0,
                adId:Number(adId)
            },include:{
                ad:true
            }

        })
        return res.send(ad);
    } catch (error) {
        console.log(error);
        return res.status(411).send("Error while liking ad");
    }
})

likeRouter.get("/liked",async (req:CustomRequest,res:Response)=>{

    try{
        const userId=req.userId?.id;
        const likedads=await prisma.like.findMany({
            where:{
                userId:userId
            },
            select:{
                ad:true,
                id:true
            }
        })
        console.log(likedads);
        return res.send(likedads)
    }
    catch(error){
        return res.status(411).send("Error while fetching liked ads");
    }   


})

export default likeRouter