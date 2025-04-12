import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

interface CustomRequest extends Request {
  userId?: { id: number };
  userName?: { name: string };
}

export const checkUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.header("Authorization") || "";
    const user = jwt.verify(header, config.JWT_SECRET) as {
      id: number;
      name: string;
    };
    if (!user) {
      return res.status(409).send("Invalid user");
    } else {
      const id: number = user.id;
      const name: string = user.name;
      const userId = { id };
      const userName = { name };
      req.userName = userName;
      req.userId = userId;
      next();
    }
  } catch (e) {
    return res.status(411).send("Wrong user");
  }
};
