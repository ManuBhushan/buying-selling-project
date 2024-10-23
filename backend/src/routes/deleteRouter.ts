import express from "express";
import { checkUser } from "../middlewares/userAuth";
import { unlikAd } from "../controllers/adController";

const deleteRouter=express();

deleteRouter.use("/",checkUser);

deleteRouter.delete("/:id",unlikAd);

export default deleteRouter