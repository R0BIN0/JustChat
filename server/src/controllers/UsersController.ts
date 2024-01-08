import { Request, Response } from "express";
import { User } from "../models/User.js";
import { IUser } from "../types/IUser.js";
import { IStatusCode } from "../types/IStatusCode.js";
import { tryCatch } from "../utils/tryCatch.js";

/**
 * This function is used to get all Users from the DB
 * @param {Request<{}, {}, {}, { userId: string; search: string; start: string; limit: string }>} req - all queries provided by client.
 * @param {Response<{ users: IUser[], total: number }>} res - Users found in the Database that corresponding with queries.
 * @returns {void}
 */
export const getAllUsersController = async (
  req: Request<{}, {}, {}, { userId: string; search: string; start: string; limit: string }>,
  res: Response<{ users: IUser[]; total: number }>
): Promise<void> => {
  const userId = req.query.userId;
  const search = req.query.search;
  const start = parseInt(req.query.start, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 10;

  let query: any = {};
  query._id = { $ne: userId };
  if (search) query.name = { $regex: new RegExp(search, "i") };

  const total = await User.countDocuments(query);
  const users: IUser[] = await User.find(query).skip(start).limit(limit);
  res.status(IStatusCode.OK).json({ users, total });
};

export const getAllUsers = tryCatch(getAllUsersController);
