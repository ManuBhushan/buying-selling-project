import express from "express"
import userRouter from "./routes/userRouter";
import cors from "cors";
import adsRouter from "./routes/adsRouter";
import likeRouter from "./routes/likeRouter";
import deleteRouter from "./routes/deleteRouter";
import path from "path";
import { config } from "./config";

const app=express();
const port=3000;
app.use(express.json());

app.use(cors({credentials:true , origin:"http://localhost:5173"}));
app.use('/api/v1/user',userRouter)
app.use('/api/v1/ads',adsRouter);
app.use("/api/v1/like",likeRouter);
app.use("/api/v1/unlike",deleteRouter);
const projectRoot = path.resolve(__dirname, '..');
app.use('/uploads', express.static(path.join(projectRoot, config.UPLOADS_DIR)));


app.listen(port,()=>{
    console.log("Server is listening on port: ", port);
})
