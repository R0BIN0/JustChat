import { Request, Response } from "express";
import { encryptPassword, getAuthenticatedToken, passwordIsConfirmed, passwordIsValid } from "../utils/password.js";
import { User } from "../models/User.js";
import { IUser } from "../types/IUser.js";
import { IStatusCode } from "../types/IStatusCode.js";
import { tryCatch } from "../utils/tryCatch.js";
import { AppError } from "../utils/AppError.js";
import { IErrorCode } from "../types/IErrorCode.js";
import { IUserDTO } from "../types/IUserDTO.js";

/**
 * This function is used to registrate a new user
 * @param {Request<{}, any, Pick<IUser> & {confirmPassword: string}>} req - Request which contain user infos and confirmPassword
 * @param {Response<{ token: string; user: IUser }>} res - Response which contain the User token and the User information
 * @returns {void}
 */
export const registerController = async (
  req: Request<{}, any, IUser & { confirmPassword: string }>,
  res: Response<{ token: string; user: IUserDTO }>
): Promise<void> => {
  const { name, email, password, confirmPassword, pictureId } = req.body;
  if (!name || !email || !password || !confirmPassword)
    throw new AppError(IErrorCode.EMPTY_INPUT, "Inputs are empty", IStatusCode.BAD_REQUEST);
  const nameIsAlreadyUsed = await User.findOne({ name });
  if (nameIsAlreadyUsed)
    throw new AppError(IErrorCode.NAME_ALREADY_USED, "This name is already used", IStatusCode.BAD_REQUEST);
  if (!passwordIsConfirmed(password, confirmPassword))
    throw new AppError(IErrorCode.CANNOT_CONFIRM_PASSWORD, "Passwords are not the same", IStatusCode.BAD_REQUEST);
  const encryptedPassword = await encryptPassword(password);
  if (!encryptedPassword) throw new AppError(IErrorCode.UNEXCPECTED_ERROR, "Unexpected Error", IStatusCode.BAD_REQUEST);
  const user = await User.create({ name, email, password: encryptedPassword, pictureId: pictureId, online: true });
  if (!user) throw new AppError(IErrorCode.CANNOT_CREATE_USER, "Not able to create User", IStatusCode.BAD_REQUEST);
  const token = getAuthenticatedToken(user.name, user.email);
  if (!token) throw new AppError(IErrorCode.CANNOT_GET_JWT_TOKEN, "Cannot get User Token", IStatusCode.NOT_FOUND);
  const userWithoutPassword = { name: user.name, email: user.email, pictureId: pictureId, online: true, _id: user.id };
  res.status(IStatusCode.CREATED).json({ token, user: userWithoutPassword });
};

/**
 * This function is used to log user
 * @param {Request<{}, any, Pick<IUser, "email" | "password">>} req - Request which contain user email and user password
 * @param {Response<{ token: string }>} res - Response which contain the User token
 * @returns {void}
 */
export const loginController = async (
  req: Request<{}, any, Pick<IUser, "email" | "password">>,
  res: Response<{ token: string; user: IUserDTO }>
): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError(IErrorCode.EMPTY_INPUT, "Inputs are empty", IStatusCode.BAD_REQUEST);
  const user: IUser = await User.findOneAndUpdate({ email }, { online: true }).select("+password");
  if (!user) throw new AppError(IErrorCode.USER_NOT_FOUND, "No User found", IStatusCode.NOT_FOUND);
  const isValid = await passwordIsValid(password, user.password);
  if (!isValid) throw new AppError(IErrorCode.INVALID_PASSWORD, "Password is invalid", IStatusCode.BAD_REQUEST);
  const token = getAuthenticatedToken(user.name, user.email);
  if (!token) throw new AppError(IErrorCode.CANNOT_GET_JWT_TOKEN, "Cannot get User Token", IStatusCode.NOT_FOUND);

  const userWithoutPassword = {
    name: user.name,
    email: user.email,
    pictureId: user.pictureId,
    online: true,
    _id: user._id,
  };
  res.status(IStatusCode.OK).json({ token, user: userWithoutPassword });
};

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

/**
 * This function is used to get all Users from the DB
 * @param {Request<{}, any, Pick<IUser, "_id">>} req - Request which contain userId to find user
 * @param {Response<{ user: IUser }>} res - User found in the Database
 * @returns {void}
 */
export const getUserByIdController = async (
  req: Request<{}, any, Pick<IUser, "_id">>,
  res: Response<{ user: IUser }>
): Promise<void> => {
  const { _id } = req.body;
  const user = await User.findById(_id);
  if (!user) throw "error";
  res.status(IStatusCode.OK).json({ user });
};

export const login = tryCatch(loginController);
export const register = tryCatch(registerController);
export const getAllUsers = tryCatch(getAllUsersController);
export const getUserById = tryCatch(getUserByIdController);
