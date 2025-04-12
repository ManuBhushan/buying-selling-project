import express from "express";
import {
  DeleteUser,
  SigninUser,
  SignupUser,
  UpdateUserPassword,
  UpdateUserProfile,
  UserProfile,
} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.post("/signup", SignupUser);
userRouter.post("/signin", SigninUser);
userRouter.delete("/delete", DeleteUser);
userRouter.get("/profile", UserProfile);
userRouter.post("/update-profile", UpdateUserProfile);
userRouter.post("/update-password", UpdateUserPassword);

export default userRouter;
