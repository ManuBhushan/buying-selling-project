import { PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { config } from '../config';
const userRouter=express();
const prisma= new PrismaClient();

userRouter.post('/signup', async (req,res)=>{
    try {

        const body= req.body;
        const user= await prisma.user.findFirst({
            where:{
                email:body.email
            }
        })
        if(user){
            return res.status(409).send("User already exist");
        }
        
        const hasdedPassword=await bcrypt.hash(body.password,10);

       const newUser= await prisma.user.create({
            data:{
                name:body.name,
                email:body.email,
                password:hasdedPassword
            }
        })
        const token= jwt.sign({id:newUser.id,name:body.name , email:body.email },config.JWT_SECRET);
        return res.send(token);

    } catch (error) {
        console.log(error);
        return res.status(411).send("Error while creating user");

    }
  
})


userRouter.post("/signin",async (req,res)=>{

    try {

        const body=req.body;
        const user=await prisma.user.findFirst({
            where:{
                email:body.email
            }
        })

        if(!user){
            return res.status(409).send("User dont exist");
        }

        // const res= check hashed password and inpt password
        const result= await bcrypt.compare(body.password,user.password);

        if(!result){
            return res.status(409).send("Wrong inputs");
        }
        const token= jwt.sign({id:user.id,name:user.name, email:user.email },config.JWT_SECRET);
        return res.send(token);

    } catch (error) {
        return res.status(411).send("Error while signing user");
        
    }
})


userRouter.delete("/delete",async(req,res)=>{
    try {

        const header=req.header("Authorization") || "";

        const validUser=jwt.verify(header,config.JWT_SECRET) as { id: number };

        if(!validUser){
                return res.status(409).send("Invalid user");
        }
        else{       
            const id:number=validUser.id;

            const result = await prisma.$transaction(async (prisma) => {
                await prisma.like.deleteMany({
                    where: {
                        userId:id   
                    },  
                });
                const deletedAd = await prisma.ads.deleteMany({
                    where: {
                      userId:id
                    }
                });
                const user= await prisma.user.delete({
                    where:{
                        id
                    }
                })
                console.log(user)
            });
        }
        return res.send("Account deleted successfully");
    }
    catch(e){
        return res.status(411).send("Wrong user");

    }
})
export default userRouter;

