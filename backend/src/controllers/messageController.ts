import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";

const prisma = new PrismaClient();

export const uploadMessage = async (req: Request, res: Response) => {
  try {
    const { message, senderId, receiverId, adId } = req.body;

    const MessageCreated = await prisma.messages.create({
      data: {
        participants: [senderId, receiverId],
        adId,
        message: message,
        senderId: senderId,
      },
    });
    // console.log("MESSAGE: ",MessageCreated);
    return res.send("HAPPY");
  } catch (error) {}
};

export const getIndividualMessage = async (req: Request, res: Response) => {
  try {
    const data = req.query;
    // console.log("Received DATA: ",data);
    const { senderId, receiverId, adId } = data;
    const allMessages = await prisma.messages.findMany({
      where: {
        adId: Number(adId),
        participants: {
          hasEvery: [Number(senderId), Number(receiverId)],
        },
      },
      select: {
        senderId: true,
        message: true,
        id: true,
        adId: true,
      },
    });
    // console.log("ALL MESSAGES: ",allMessages);
    return res.send(allMessages);
  } catch (error) {}
};

export const getUserAllChat = async (req: Request, res: Response) => {
  try {
    const senderId = req.params.senderId;
    const messages = await prisma.messages.findMany({
      where: {
        senderId: Number(senderId),
        NOT: {
          ad: {
            userId: Number(senderId),
          },
        },
      },
      select: {
        ad: {
          select: {
            title: true,
            price: true,
            sold: true,
            userId: true,
            user: { select: { name: true } },
          },
        },

        adId: true,
      },
    });
    const uniqueMessages = Array.from(
      messages
        .reduce((map, message) => {
          if (!map.has(message.adId)) {
            map.set(message.adId, message);
          }
          return map;
        }, new Map())
        .values(),
    );

    console.log(uniqueMessages);
    return res.send(uniqueMessages);
  } catch (error) {}
};

export const getAllAdQuery = async (req: Request, res: Response) => {
  try {
    const { ownerId } = req.query;

    const messages = await prisma.messages.findMany({
      where: {
        ad: {
          userId: Number(ownerId),
        },
        NOT: {
          senderId: Number(ownerId),
        },
      },
      select: {
        ad: {
          select: {
            title: true,
            price: true,
            id: true,
          },
        },
        sender: {
          select: {
            name: true,
            id: true,
          },
        }, // what i want is name title price adId
      },
    });
    const uniqueMessages = Array.from(
      messages
        .reduce((map, message) => {
          const key = `${message.sender.id}-${message.ad.id}`; // Combine senderId and adId as a unique key
          if (!map.has(key)) {
            map.set(key, message);
          }
          return map;
        }, new Map())
        .values(),
    );
    console.log(uniqueMessages);
    return res.send(uniqueMessages);
  } catch (error) {}
};
