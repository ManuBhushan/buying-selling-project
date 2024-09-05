import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Response,Request } from "express";
import jwt from "jsonwebtoken"

import { config } from '../config';
const adsRouter=express();


const prisma=new PrismaClient();

interface CustomRequest extends Request {
    userId?: { id: number };
  }


adsRouter.use("/",(req: CustomRequest, res: Response, next: NextFunction)=>{
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

adsRouter.post("/createAd", async (req:CustomRequest,res:Response)=>{
    try {
        const userid=req.userId?.id;
        const { price, title, description, category,imageLink, } = req.body;

        const data = {
            userId:userid,
            price: price,
            imageLink:imageLink,
            ...(title && { title: title }),
            ...(description && { description: description }),
            ...(category && { category: category }),
          };
          
          const ad=await prisma.ads.create({data});

          return res.send(ad);
                
        
        
    } catch (error) {
        console.log(error);
            return res.status(411).send("Error while creating ad");
    }
})

adsRouter.get('/myads',async (req:CustomRequest,res:Response)=>{
    try{
        const userId=req.userId?.id;

        const ads=await prisma.ads.findMany({
            where:{
                userId:userId
            }
        });
        return res.send(ads);
    }
    catch(e){
        return res.status(411).send("Error while fetching ads");
    }
});

export default adsRouter;
