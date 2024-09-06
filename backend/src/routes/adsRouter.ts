import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Response,Request } from "express";
import jwt from "jsonwebtoken"
import * as path from 'path';
import multer from "multer";
import { config } from '../config';


const adsRouter=express();

const prisma=new PrismaClient();

interface CustomRequest extends Request {
    userId?: { id: number };
  }

  adsRouter.use('/uploads', express.static(path.join(__dirname, '..', '..',config.UPLOADS_DIR)));

    const storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            const destinationPath = path.join(__dirname, '..', '..', config.UPLOADS_DIR);
            console.log(__dirname);
            console.log(destinationPath);

            cb(null, destinationPath);
        },
        filename:(req,file,cb)=>{
            const fileName=Date.now()+'-'+file.originalname;
            cb(null,fileName);
        }
    })

const upload = multer({ storage: storage });

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
            price: price,
            imageLink:req.file?.path,
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

adsRouter.delete("/delete/:id",async(req:CustomRequest,res:Response)=>{
    try {

        // if u want to delete an ad delete it from like also if it is present their 
        const userId=req.userId?.id;
        const id=req.params.id;
        const ad=await prisma.ads.delete( {
                where:{
                    id:Number(id),
                    userId:userId
                }
                ,include:{
                    user:true,
                }
            })
                console.log(ad);
            return res.send("Ad deleted");
    } catch (error) {
        console.log(error);
        return res.status(411).send("Error while deleting ad")
    }
})

export default adsRouter;



// adsRouter.delete("/delete/:id", async (req: CustomRequest, res: Response) => {
//     const userId = req.userId?.id;
//     const id = parseInt(req.params.id, 10);

//     if (!userId) {
//         return res.status(401).send("Unauthorized");
//     }

//     try {
//         const result = await prisma.$transaction(async (prisma) => {
//             // Delete likes associated with the ad
//             await prisma.likes.deleteMany({
//                 where: {
//                     adId: id,
//                 },
//             });

//             // Delete the ad
//             const deletedAd = await prisma.ads.delete({
//                 where: {
//                     id: id,
//                     userId: userId,
//                 },
//                 include: {
//                     user: true,
//                 },
//             });

//             return deletedAd;
//         });

//         console.log(result);
//         return res.send("Ad and associated likes deleted");
//     } catch (error) {
//         console.log(error);
//         return res.status(411).send("Error while deleting ad and likes");
//     }
// });

