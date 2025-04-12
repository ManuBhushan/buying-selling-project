import express from "express";
import {
  createAd,
  deleteParticularAd,
  getAllAdsWithogin,
  getAllAdsWithoutLogin,
  getOwnAds,
  getParticularAd,
  getSearchedAdsWithLogin,
  getSearchedAdsWithoutLogin,
  getUserInfo,
  myAds,
  unlikeRouter,
  updateAdSoldStatus,
} from "../controllers/adController";
import { checkUser } from "../middlewares/userAuth";
import { serveUploads, upload } from "../controllers/upload";

const adsRouter = express.Router();

adsRouter.use("/uploads", serveUploads);

adsRouter.get("/bulk", getAllAdsWithoutLogin);
adsRouter.get("/search", getSearchedAdsWithoutLogin); //   URL=>{ ../search?sort={value} }
adsRouter.get("/ad/:id", getParticularAd);

adsRouter.use("/", checkUser);
adsRouter.delete("/unlike/:id", unlikeRouter);

adsRouter.get("/search/withlike", getSearchedAdsWithLogin); //  URL=>{ ../search/withlike?sort={value} }
adsRouter.get("/bulk/withlike", getAllAdsWithogin);
adsRouter.get("/", getUserInfo);
adsRouter.get("/own", getOwnAds);
adsRouter.post("/createAd", upload.single("file"), createAd);
adsRouter.get("/myads", myAds);
adsRouter.delete("/delete/:id", deleteParticularAd);
adsRouter.get("/sold", updateAdSoldStatus);

export default adsRouter;
