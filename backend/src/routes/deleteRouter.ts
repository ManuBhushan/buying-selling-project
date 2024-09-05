import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Response,Request } from "express";
import jwt from "jsonwebtoken"

import { config } from '../config';

const deleteRouter=express();


const prisma=new PrismaClient();

interface CustomRequest extends Request {
    userId?: { id: number };
  }


  deleteRouter.use("/",(req: CustomRequest, res: Response, next: NextFunction)=>{
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
            console.log(id);
            next();
            }
    }
    catch(e){
        return res.status(411).send("Wrong user");

    }
})


deleteRouter.post("/:id",async (req:CustomRequest,res:Response)=>{
    try {
        const likeId=req.params.id;
        console.log(likeId);
        
        const ad=await prisma.like.delete({
            where:{
              id:Number(likeId)
            }
        })
        return res.send(ad);
    } catch (error) {
        console.log(error);
        return res.status(411).send("Error while liking ad");
    }
})

export default deleteRouter