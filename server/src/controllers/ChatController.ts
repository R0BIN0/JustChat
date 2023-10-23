import { Request, Response } from "express";
import { User } from "../models/User.js";
import { Chat } from "../models/Chat.js";
import { tryCatch } from "../utils/tryCatch.js";
import { IChat } from "../types/IChat.js";
import { AppError } from "../utils/AppError.js";
import { IErrorCode } from "../types/IErrorCode.js";
import { IStatusCode } from "../types/IStatusCode.js";

export const getChatController = async (
  req: Request<{}, {}, {}, { userId: string; otherUserId: string }>,
  res: Response<{ chat: IChat }>
): Promise<void> => {
  let chat: IChat;
  const userIds = req.query;
  const getUsersAsync = Object.values(userIds).map(
    async (id) => await User.findOne({ _id: id }).select("+conversationIds")
  );
  const users = await Promise.all(getUsersAsync);
  const [user1, user2] = users;

  if (!user1 || !user2)
    throw new AppError(IErrorCode.USERS_NOT_FOUND, "Cannot get users to chat", IStatusCode.NOT_FOUND);

  const conversationId = user1.conversationIds.filter((item) => user2.conversationIds.includes(item))[0];
  if (conversationId) {
    chat = (await Chat.findOne({ _id: conversationId })) as IChat;
    if (!chat) throw new AppError(IErrorCode.NO_CHAT_FOUND, "Cannot get Chat infos", IStatusCode.NOT_FOUND);
  } else {
    chat = await Chat.create({ createdAt: Date.now(), message: [] });
    if (!chat) throw new AppError(IErrorCode.CANNOT_CREATE_CHAT, "Cannot create Chat", IStatusCode.BAD_REQUEST);
    users.forEach((user) => {
      user?.conversationIds.push(chat._id);
      user?.save();
    });
  }
  res.status(IStatusCode.OK).json({ chat });
};

export const getChat = tryCatch(getChatController);
