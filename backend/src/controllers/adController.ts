import { PrismaClient } from "@prisma/client";
import { Response,Request } from "express";
import * as path from 'path';
import * as fs from "fs"

interface CustomRequest extends Request {
    userId?: { id: number };
    userName?:{name:string};
}


const prisma=new PrismaClient();


export const getAllAdsWithoutLogin=async(req:Request,res:Response)=>{
   
        try{
            const allads=await prisma.ads.findMany({
                where:{
                    sold:false
                },orderBy:{
                    createdAt:'desc'
                }
            }) 
            return res.send(allads); 
        }
        catch(error){
            return res.status(411).send("Error while fetching ads");        
        }
}

export const getSearchedAdsWithoutLogin=async(req:Request,res:Response)=>{
    try{
        // req.query.sort can be { string,string[] }
        const category= typeof req.query.category === 'string' ? req.query.category : 'others';
        const sort= typeof req.query.sort === 'string' ? req.query.sort : 'none';
        if(category==="others" && sort==="none"){
            const ads= await prisma.ads.findMany({
                where:{
                    sold:false,
                },orderBy:{
                    createdAt:'desc'
                }
               })        
               return res.send(ads);
        }
        else if(sort==="none"){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                    OR: [
                        { category: {contains:category,mode:'insensitive' } },
                        { title: { contains: category, mode: 'insensitive' } },
                        { description: { contains: category, mode: 'insensitive' } }
                    ]
                }
            });    
               return res.send(ads);
        }
        else if(category==="others" && sort==="asc"){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                },orderBy:{
                    price:"asc"
                }
            });    
               return res.send(ads);
        }
        else if(category==="others" && sort==='desc'){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                },orderBy:{
                    price:"desc"
                }
            });    
               return res.send(ads);
        }
        else if(category==='others' && sort==='createdAt'){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                   
                },orderBy:{
                    createdAt:"asc"
                }
            });    
               return res.send(ads);
        }
        else if(sort==="asc"){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                    OR: [
                        { category: {contains:category,mode:'insensitive' } },
                        { title: { contains: category, mode: 'insensitive' } },
                        { description: { contains: category, mode: 'insensitive' } }
                    ]
                },orderBy:{
                    price:"asc"
                }
            });    
               return res.send(ads);
        }
        else if(sort==="desc"){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                    OR: [
                        { category: {contains:category,mode:'insensitive' } },
                        { title: { contains: category, mode: 'insensitive' } },
                        { description: { contains: category, mode: 'insensitive' } }
                    ]
                },orderBy:{
                    price:"desc"
                }
            });    
               return res.send(ads);
        }
        else if(sort==='createdAt'){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                    OR: [
                        { category: {contains:category,mode:'insensitive' } },
                        { title: { contains: category, mode: 'insensitive' } },
                        { description: { contains: category, mode: 'insensitive' } }
                    ]
                },orderBy:{
                    createdAt:"asc"
                }
            });    
               return res.send(ads);
        }
    }

    catch(error){
        return res.status(411).send("Error while fetching ads by category");
    }
}

export const getParticularAd=async(req:Request,res:Response)=>{
    try{
        const id=req.params.id;
        const ad=await prisma.ads.findFirst({
            where:{
                id:Number(id)
            },
              include:{
                user:{
                    select:{
                        name:true
                    }
                }
              }
        })
        // console.log(ad);
        return res.send(ad);
    }
    catch(error){

    }
}



export const getSearchedAdsWithLogin=async(req:CustomRequest,res:Response)=>{

    try{
        const userId = req.userId?.id;
        // req.query.sort can be { string,string[] }
        const category= typeof req.query.category === 'string' ? req.query.category : 'others';
        const sort= typeof req.query.sort === 'string' ? req.query.sort : 'none';
        if(category==="others" && sort==="none"){
            const ads= await prisma.ads.findMany({
                where:{
                    sold:false,
                },orderBy:{
                    createdAt:'desc'
                }
               })  

               const likedAds = await prisma.like.findMany({
                where: {
                  userId: userId,
                },
                select: {
                  adId: true, // Get the ids of the liked ads
                },
              });
          
              // Create a Set of liked ad IDs for quick lookup
              const likedAdIds = new Set(likedAds.map(like => like.adId));
          
              // Map over the ads and add a `liked` field based on whether the adId is in the likedAdIds set
              const adsWithLikeStatus = ads.map(ad => ({
                ...ad,
                liked: likedAdIds.has(ad.id), // Set `liked` as true if the ad is liked, otherwise false
              }));
              return res.send(adsWithLikeStatus);   
        }
        else if(sort==="none"){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                    OR: [
                        { category: {contains:category,mode:'insensitive' } },
                        { title: { contains: category, mode: 'insensitive' } },
                        { description: { contains: category, mode: 'insensitive' } }
                    ]
                }
            });    
            const likedAds = await prisma.like.findMany({
                where: {
                  userId: userId,
                },
                select: {
                  adId: true, // Get the ids of the liked ads
                },
              });
          
              // Create a Set of liked ad IDs for quick lookup
              const likedAdIds = new Set(likedAds.map(like => like.adId));
          
              // Map over the ads and add a `liked` field based on whether the adId is in the likedAdIds set
              const adsWithLikeStatus = ads.map(ad => ({
                ...ad,
                liked: likedAdIds.has(ad.id), // Set `liked` as true if the ad is liked, otherwise false
              }));
          
              return res.send(adsWithLikeStatus);
        }
        else if(category==="others" && sort==="asc"){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                },orderBy:{
                    price:"asc"
                }
            });    
            const likedAds = await prisma.like.findMany({
                where: {
                  userId: userId,
                },
                select: {
                  adId: true, // Get the ids of the liked ads
                },
              });
          
              // Create a Set of liked ad IDs for quick lookup
              const likedAdIds = new Set(likedAds.map(like => like.adId));
          
              // Map over the ads and add a `liked` field based on whether the adId is in the likedAdIds set
              const adsWithLikeStatus = ads.map(ad => ({
                ...ad,
                liked: likedAdIds.has(ad.id), // Set `liked` as true if the ad is liked, otherwise false
              }));
          
              return res.send(adsWithLikeStatus);
        }
        else if(category==="others" && sort==='desc'){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                },orderBy:{
                    price:"desc"
                }
            });    
            const likedAds = await prisma.like.findMany({
                where: {
                  userId: userId,
                },
                select: {
                  adId: true, // Get the ids of the liked ads
                },
              });
          
              // Create a Set of liked ad IDs for quick lookup
              const likedAdIds = new Set(likedAds.map(like => like.adId));
          
              // Map over the ads and add a `liked` field based on whether the adId is in the likedAdIds set
              const adsWithLikeStatus = ads.map(ad => ({
                ...ad,
                liked: likedAdIds.has(ad.id), // Set `liked` as true if the ad is liked, otherwise false
              }));
          
              return res.send(adsWithLikeStatus);
        }
        else if(category==='others' && sort==='createdAt'){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                   
                },orderBy:{
                    createdAt:"asc"
                }
            });    
            const likedAds = await prisma.like.findMany({
                where: {
                  userId: userId,
                },
                select: {
                  adId: true, // Get the ids of the liked ads
                },
              });
          
              // Create a Set of liked ad IDs for quick lookup
              const likedAdIds = new Set(likedAds.map(like => like.adId));
          
              // Map over the ads and add a `liked` field based on whether the adId is in the likedAdIds set
              const adsWithLikeStatus = ads.map(ad => ({
                ...ad,
                liked: likedAdIds.has(ad.id), // Set `liked` as true if the ad is liked, otherwise false
              }));
          
              return res.send(adsWithLikeStatus);
        }
        else if(sort==="asc"){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                    OR: [
                        { category: {contains:category,mode:'insensitive' } },
                        { title: { contains: category, mode: 'insensitive' } },
                        { description: { contains: category, mode: 'insensitive' } }
                    ]
                },orderBy:{
                    price:"asc"
                }
            });    
            const likedAds = await prisma.like.findMany({
                where: {
                  userId: userId,
                },
                select: {
                  adId: true, // Get the ids of the liked ads
                },
              });
          
              // Create a Set of liked ad IDs for quick lookup
              const likedAdIds = new Set(likedAds.map(like => like.adId));
          
              // Map over the ads and add a `liked` field based on whether the adId is in the likedAdIds set
              const adsWithLikeStatus = ads.map(ad => ({
                ...ad,
                liked: likedAdIds.has(ad.id), // Set `liked` as true if the ad is liked, otherwise false
              }));
          
              return res.send(adsWithLikeStatus);
        }
        else if(sort==="desc"){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                    OR: [
                        { category: {contains:category,mode:'insensitive' } },
                        { title: { contains: category, mode: 'insensitive' } },
                        { description: { contains: category, mode: 'insensitive' } }
                    ]
                },orderBy:{
                    price:"desc"
                }
            });    
            const likedAds = await prisma.like.findMany({
                where: {
                  userId: userId,
                },
                select: {
                  adId: true, // Get the ids of the liked ads
                },
              });
          
              // Create a Set of liked ad IDs for quick lookup
              const likedAdIds = new Set(likedAds.map(like => like.adId));
          
              // Map over the ads and add a `liked` field based on whether the adId is in the likedAdIds set
              const adsWithLikeStatus = ads.map(ad => ({
                ...ad,
                liked: likedAdIds.has(ad.id), // Set `liked` as true if the ad is liked, otherwise false
              }));
          
              return res.send(adsWithLikeStatus);
        }
        else if(sort==='createdAt'){
            const ads= await prisma.ads.findMany({
                where: {
                    sold: false,
                    OR: [
                        { category: {contains:category,mode:'insensitive' } },
                        { title: { contains: category, mode: 'insensitive' } },
                        { description: { contains: category, mode: 'insensitive' } }
                    ]
                },orderBy:{
                    createdAt:"asc"
                }
            });  
            const likedAds = await prisma.like.findMany({
                where: {
                  userId: userId,
                },
                select: {
                  adId: true, // Get the ids of the liked ads
                },
              });
          
              // Create a Set of liked ad IDs for quick lookup
              const likedAdIds = new Set(likedAds.map(like => like.adId));
          
              // Map over the ads and add a `liked` field based on whether the adId is in the likedAdIds set
              const adsWithLikeStatus = ads.map(ad => ({
                ...ad,
                liked: likedAdIds.has(ad.id), // Set `liked` as true if the ad is liked, otherwise false
              }));
          
              return res.send(adsWithLikeStatus);  
        }
    }

    catch(error){
        return res.status(411).send("Error while fetching ads by category");
    }
}

export const getAllAdsWithogin= async (req: CustomRequest, res: Response) =>{
    try {
        const userId = req.userId?.id;
    
        // Fetch all ads from the database
        const ads = await prisma.ads.findMany({
          where: {
            sold: false,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
    
        // Fetch all the ads liked by the user
        const likedAds = await prisma.like.findMany({
          where: {
            userId: userId,
          },
          select: {
            adId: true, // Get the ids of the liked ads
          },
        });
    
        // Create a Set of liked ad IDs for quick lookup
        const likedAdIds = new Set(likedAds.map(like => like.adId));
    
        // Map over the ads and add a `liked` field based on whether the adId is in the likedAdIds set
        const adsWithLikeStatus = ads.map(ad => ({
          ...ad,
          liked: likedAdIds.has(ad.id), // Set `liked` as true if the ad is liked, otherwise false
        }));
        return res.send(adsWithLikeStatus);
      } catch (error) {
        return res.status(411).send("Error while fetching ads");
      }
}

export const getUserInfo=(req: CustomRequest, res: Response) =>{
    return res.send({validUser:true,userId:req.userId?.id,userName:req.userName?.name});
}

export const getOwnAds=async (req:CustomRequest,res:Response)=>{

    try{
        const userId=req.userId?.id;
        const myAds=await prisma.ads.findMany({
            where:{
                userId:userId
            }
        })
        return res.send(myAds);
    }
    catch(error){
        return res.status(200).send("Error while fetching your ads");
    }
}


export const createAd= async (req:CustomRequest,res:Response)=>{
    try {
        const userid=req.userId?.id;
        const { price, title, description, category,file } = req.body;
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
}

export const myAds=async (req:CustomRequest,res:Response)=>{
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
}

export const deleteParticularAd= async (req: CustomRequest, res: Response) => {
    const userId = req.userId?.id;
    const id = parseInt(req.params.id);

    try {
        const result = await prisma.$transaction(async (prisma) => {
          
            await prisma.messages.deleteMany({
                where:{
                    adId:id
                }
            })
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
}

export const updateAdSoldStatus=async (req: CustomRequest, res: Response) => {
    const userId = req.userId?.id;
   
    const {id,currentSold}=req.query;
    
    try {   
        if(currentSold==="false"){
            const ad= await prisma.ads.update({
                where:{
                    id:Number(id)
                },
                data:{
                sold:true
                }
              })   
      return res.send(ad);

        }
        else{
            const ad= await prisma.ads.update({
                where:{
                    id:Number(id)
                },
                data:{
                sold:false
                }
              })
              return res.send(ad);

        }
    
    } catch (error) {

    }
}


export const getAllUserLikedAds=async (req:CustomRequest,res:Response)=>{

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
        // console.log(likedads);
        return res.send(likedads)
    }
    catch(error){
        return res.status(411).send("Error while fetching liked ads");
    }   
}

export const likeAd=async (req:CustomRequest,res:Response)=>{
    try {
        const userId =req.userId?.id;
        const adId=req.params.id;
        
        const ad=await prisma.like.create({
            data:{
                userId:Number(userId) ,
                adId:Number(adId)
            },include:{
                ad:true
            }

        })
        return res.send(ad);
    } catch (error) {
        return res.status(411).send("Error while liking ad");
    }
};

export const unlikAd=async (req:CustomRequest,res:Response)=>{
    try {
        const userId=req.userId?.id
        const adId=req.params.id;        
        const ad=await prisma.like.delete({
           where:{
            userId_adId: {
                userId: Number(userId),
                adId: Number(adId),
              }
           } 
        })
        return res.send(ad);
    } catch (error) {
        return res.status(411).send("Error while liking ad");
    }
}