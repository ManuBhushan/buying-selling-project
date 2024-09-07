import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Response,Request } from "express";
import jwt from "jsonwebtoken"
import * as path from 'path';
import multer from "multer";
import { config } from '../config';
import * as fs from "fs"

const adsRouter=express();

const prisma=new PrismaClient();

interface CustomRequest extends Request {
    userId?: { id: number };
  }

  adsRouter.use('/uploads', express.static(path.join(__dirname, '..', '..',config.DATABASE_URL)));


    const storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            const destinationPath = path.join(__dirname, '..', '..', config.UPLOADS_DIR);
            console.log(destinationPath);
            cb(null, destinationPath);
        },
        filename:(req,file,cb)=>{
            const fileName=Date.now()+'-'+file.originalname;
            cb(null,fileName);
        }
    })



const upload = multer({ storage: storage });




adsRouter.get("/bulk",async (req,res)=>{
    try{
        const allads=await prisma.ads.findMany({
            where:{
                sold:false
            }
        }) 
        return res.send(allads); // check in front end it response.size ==0 then print  --> No active ads right now 
    }
    catch(error){
        return res.status(411).send("Error while fetching ads");
        // what if their are no adds availabe on the website 
        
    }
})  

adsRouter.get("/search",async (req,res)=>{ //   URL=>{ ../search?sort={value} }
    try{
        // req.query.sort can be { string,string[] }
        const category= typeof req.query.category === 'string' ? req.query.category : 'others';
        if(category==="others"){
            const ads= await prisma.ads.findMany({
                where:{
                    sold:false,
                }
               })        
               return res.send(ads);
        }
        else{
            const ads= await prisma.ads.findMany({
                where:{
                    sold:false,
                    category:category
                }
               })        
               return res.send(ads);
        }
    }

    catch(error){
        return res.status(411).send("Error while fetching ads by category");
    }
})

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

adsRouter.post("/createAd",upload.single('file'), async (req:CustomRequest,res:Response)=>{
    try {
        const userid=req.userId?.id;
        const { price, title, description, category,imageLink, } = req.body;
        const data = {
            userId:userid,
            price: Number(price),
            imageLink:req.file?.path,
            ...(title && { title: title }),
            ...(description && { description: description }),
            ...(category && { category: category }),
          };
        const ad=await prisma.ads.create({data});
        return res.send(ad);
    } catch (error) {
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

adsRouter.delete("/delete/:id", async (req: CustomRequest, res: Response) => {
    const userId = req.userId?.id;
    const id = parseInt(req.params.id);

    try {
        const result = await prisma.$transaction(async (prisma) => {
            await prisma.like.deleteMany({
                where: {
                    adId: id,   
                },  
            });
            const deletedAd = await prisma.ads.delete({
                where: {
                    id: id,
                    userId: userId,
                },
                include: { 
                    user: true,
                },
            });
            const imageLink=deletedAd.imageLink;
            fs.unlink(path.join(imageLink), (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).send('Error deleting file');
                }
            });
        });
        return res.send("Ad and associated likes deleted");
    } catch (error) {
        return res.status(411).send("Error while deleting ad and likes");
    }
});



export default adsRouter;
