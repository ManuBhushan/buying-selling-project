import express from "express"
import userRouter from "./routes/userRouter";
import cors from "cors";
import adsRouter from "./routes/adsRouter";
import likeRouter from "./routes/likeRouter";
import deleteRouter from "./routes/deleteRouter";


const app=express();
const port=3000;
app.use(express.json());

app.use(cors());
app.use('/api/v1/user',userRouter)
app.use('/api/v1/ads',adsRouter);
app.use("/api/v1/like",likeRouter);
app.use("/api/v1/delete",deleteRouter);

app.listen(port,()=>{
    console.log("Server is listening on port: ", port);
})
