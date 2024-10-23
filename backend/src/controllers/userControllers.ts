import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"
import { config } from '../config';
import bcrypt from 'bcrypt';
import { Request, Response } from "express";
const prisma=new PrismaClient();


export const SignupUser= async(req:Request,res:Response)=>{
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
        return res.send({token,userId:newUser.id,userName:newUser.name});

    } catch (error) {
        return res.status(411).send("Error while creating user");

    }
}

export const SigninUser= async(req:Request,res:Response)=>{
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
        return res.send({token,userId:user.id,userName:user.name});

    } catch (error) {
        return res.status(411).send("Error while signing user");
        
    }

}

export const DeleteUser=async (req:Request,res:Response)=>{
    try {
        const password=req.body;
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
                const deleteMessage=await prisma.messages.deleteMany({
                    where:{
                        participants:{
                            hasSome:[id]
                        }
                    }
                })
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
            });
        }
        return res.send("Account deleted successfully");
    }
    catch(e){
        return res.status(411).send("Wrong user");

    }
}

export const UserProfile=async(req:Request,res:Response)=>{
    try {

        const header=req.header("Authorization") || "";

        const validUser=jwt.verify(header,config.JWT_SECRET) as { id: number };

        if(!validUser){
                return res.status(409).send("Invalid user");
        }

        const id:number=validUser.id;
        const profile=await prisma.user.findFirst({
            where:{
           id:id     
            },
            select:{
                name: true,
                email: true,
                createdAt:true,
                updatedAt:true,
            }
        })
        return res.send(profile);
          
        
      
    }
    catch(e){
        return  res.status(411).send("Error while fetching profile info");

    }
}

export const UpdateUserProfile=async(req:Request,res:Response)=>{
    try {

        const header=req.header("Authorization") || "";        
        const validUser=jwt.verify(header,config.JWT_SECRET) as { id: number };

        if(!validUser){
                return res.status(409).send("Invalid user");
        }
        const {name,email}=req.body;
        const id:number=validUser.id;

        const ExistingUser=await prisma.user.findFirst({
            where:{
                email:email
            }
            ,select:{
                id:true
            }
        })
        if(ExistingUser && ExistingUser.id!=id){
            return res.status(409).send("Email already in use ");
        }
        await prisma.user.update({
            where:{
                id:id
            }
            ,data:{
                name,
                email
            }
        })
        return res.status(200).send("Profile Updated Successfully");

    }
    catch(e){
        return res.status(411).send("Error while updating profile");
    }
}

export const UpdateUserPassword=async(req:Request,res:Response)=>{
    try {

        const header=req.header("Authorization") || "";        
        const validUser=jwt.verify(header,config.JWT_SECRET) as { id: number };

        if(!validUser){
                return res.status(409).send("Invalid user");
        }

        const {oldPassword , newPassword}=req.body;
        const id:number=validUser.id;

        const user=await prisma.user.findFirst({
            where:{
                id
            }
        });
        
        const result= await bcrypt.compare(oldPassword , user?.password || "");

        if(!result){
            return res.status(409).send("Incorrect Password");
        }

        const hasdedPassword=await bcrypt.hash(newPassword,10);

        await prisma.user.update({
            where:{
                id
            },data:{
                password:hasdedPassword
            }
        })

        return res.send("Password updated Successfully!");  
    }
    catch(e){
        return res.status(411).send("Error while updating password");
    }
}