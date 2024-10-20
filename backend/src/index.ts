import express, { query } from "express"
import userRouter from "./routes/userRouter";
import cors from "cors";
import adsRouter from "./routes/adsRouter";
import likeRouter from "./routes/likeRouter";
import deleteRouter from "./routes/deleteRouter";
import path from "path";
import { config } from "./config";

import { createServer } from "http";
import {Server} from "socket.io"
import {  PrismaClient } from "@prisma/client";


const app=express();
const port=3000;
app.use(express.json());

const httpserver=createServer(app);

app.use(cors({credentials:true , origin:"http://localhost:5173"}));

const io=new Server(httpserver,
     {
        cors:{
            origin:"http://localhost:5173",
            credentials:true,
            methods:["GET","POST"]
        }
    }   
)

const map=new Map();
io.on("connection",(socket)=>{
        const userId=socket.handshake.query.userId;
        map.set(userId,socket.id);
        const isValid=socket.handshake.query.isValid;
        console.log("Map: ",map);

        console.log("Socket connected with Socket id: ",socket.id);
        socket.on("private-message",(data)=>{
           const {message,receiverId,adId,senderName,title}=data;
           console.log("private-message: ",data);
           io.to((map.get(String(receiverId)))).emit("private-message",{message,adId,senderId:userId});
           io.to((map.get(String(receiverId)))).emit("notification",{senderName,title,message});

        })

        socket.on("disconnect",(reason)=>{
            map.delete(String(userId));

        })       
})



app.use('/api/v1/user',userRouter)
app.use('/api/v1/ads',adsRouter);
app.use("/api/v1/like",likeRouter);
app.use("/api/v1/unlike",deleteRouter);
const projectRoot = path.resolve(__dirname, '..');
app.use('/uploads', express.static(path.join(projectRoot, config.UPLOADS_DIR)));
const prisma=new PrismaClient();

app.post('/api/v2/message',async (req,res)=>{

try {
        const {message , senderId,receiverId,adId}=req.body;

        const MessageCreated =await prisma.messages.create(
            {
                data:{
                    participants:[senderId,receiverId],
                    adId,
                    message:message,
                    senderId:senderId
                
                }
            }
        )
        console.log("MESSAGE: ",MessageCreated);
        return res.send("HAPPY");
} catch (error) {
    
}


})


app.get('/api/v2/indiMessages',async(req,res)=>{

    try {
            const data=req.query;
            console.log("Received DATA: ",data);
            const { senderId,receiverId,adId}=data;
            const allMessages=await prisma.messages.findMany({
                where:{
                    adId:Number(adId),
                    participants:{
                        hasEvery: [ Number(senderId),Number(receiverId)]
                        
                    }
                },
                select:{
                    senderId:true,
                    message:true,
                    id:true,
                    adId:true
                }
            })
            console.log("ALL MESSAGES: ",allMessages);
            return res.send(allMessages);
    } catch (error) {
        
    }
    })

    app.get("/api/v2/messages/:senderId",async(req,res)=>{

        try {
                const senderId=req.params.senderId;

                const messages=await prisma.messages.findMany({
                    where:{
                        senderId:Number(senderId),
                        NOT:{
                            ad:{
                                userId:Number(senderId)
                            }
                        }
                    },select:{
                        ad:{
                            select:{
                                title:true,
                                price:true,
                                sold:true,
                                userId:true,
                                user:{select:{name:true}}
                            }
                        },
                       
                        adId:true,
                    }
                })
               const uniqueMessages = Array.from(
                messages.reduce((map, message) => {
                    if (!map.has(message.adId)) {
                        map.set(message.adId, message);
                    }
                    return map;
                }, new Map()).values()
            );
    
            console.log(uniqueMessages);
            return res.send(uniqueMessages);
        } catch (error) {
            
        }
    })

app.get('/api/v2/saleQuery',async(req,res)=>{

    try {
        const {ownerId}=req.query;

        const messages=await prisma.messages.findMany({
            where:{
                ad:{
                    userId:Number(ownerId)
                },
                NOT:{
                    senderId:Number(ownerId)
                }
            },
            select:{
                ad:{
                    select:{
                        title:true,
                        price:true,
                        id:true,
                    }

                },
                sender:{
                    select:{
                        name:true,
                        id:true
                    }
                } // what i want is name title price adId
                
            }
        })
        const uniqueMessages = Array.from(
            messages.reduce((map, message) => {
                const key = `${message.sender.id}-${message.ad.id}`; // Combine senderId and adId as a unique key
                if (!map.has(key)) {
                    map.set(key, message);
                }
                return map;
            }, new Map()).values()
        );
        console.log(uniqueMessages);
        return res.send(uniqueMessages);


    } catch (error) {
       
        

    }

})


/************************************************* */


httpserver.listen(port,()=>{
    console.log("Server is listening on port: ", port);
})

/************************************************* */

// app.listen(port,()=>{
//     console.log("Server is listening on port: ", port);
// })
