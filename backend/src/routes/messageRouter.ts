import express from "express";
import { checkUser } from "../middlewares/userAuth";
import {
  getAllAdQuery,
  getIndividualMessage,
  getUserAllChat,
  uploadMessage,
} from "../controllers/messageController";

const messageRouter = express.Router();

messageRouter.use("/", checkUser);
messageRouter.post("/createChat", uploadMessage);
messageRouter.get("/indiMessages", getIndividualMessage);
messageRouter.get("/saleQuery", getAllAdQuery);
messageRouter.get("/:senderId", getUserAllChat); // dont change order of /saleQuery and /:senderId

export default messageRouter;
