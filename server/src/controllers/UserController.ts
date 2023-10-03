import { Request, Response } from "express";
import { encryptPassword, getAuthenticatedToken, passwordIsConfirmed, passwordIsValid } from "../utils/password.js";
import { User } from "../models/User.js";
import { IUser } from "../types/IUser.js";
import { IStatusCode } from "../types/IStatusCode.js";
import { tryCatch } from "../utils/tryCatch.js";
import { AppError } from "../utils/AppError.js";
import { IErrorCode } from "../types/IErrorCode.js";

/**
 * This function is used to registrate a new user
 * @param {Request<{}, any, Pick<IUser> & {confirmPassword: string}>} req - Request which contain user infos and confirmPassword
 * @param {Response<{ token: string; user: IUser }>} res - Response which contain the User token and the User information
 * @returns {void}
 */
export const registerController = async (
  req: Request<{}, any, IUser & { confirmPassword: string }>,
  res: Response<{ token: string; user: Omit<IUser, "password"> }>
): Promise<void> => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword)
    throw new AppError(IErrorCode.EMPTY_INPUT, "Inputs are empty", IStatusCode.BAD_REQUEST);
  const nameIsAlreadyUsed = await User.findOne({ name });
  if (nameIsAlreadyUsed)
    throw new AppError(IErrorCode.NAME_ALREADY_USED, "This name is already used", IStatusCode.BAD_REQUEST);
  if (!passwordIsConfirmed(password, confirmPassword))
    throw new AppError(IErrorCode.CANNOT_CONFIRM_PASSWORD, "Passwords are not the same", IStatusCode.BAD_REQUEST);
  const encryptedPassword = await encryptPassword(password);
  if (!encryptedPassword) throw new AppError(IErrorCode.UNEXCPECTED_ERROR, "Unexpected Error", IStatusCode.BAD_REQUEST);
  const user = await User.create({ name, email, password: encryptedPassword });
  if (!user) throw new AppError(IErrorCode.CANNOT_CREATE_USER, "Not able to create User", IStatusCode.BAD_REQUEST);
  const token = getAuthenticatedToken(user.name, user.email);
  if (!token) throw new AppError(IErrorCode.CANNOT_GET_JWT_TOKEN, "Cannot get User Token", IStatusCode.NOT_FOUND);
  const userWithoutPassword = { name: user.name, email: user.email };
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
  res: Response<{ token: string }>
): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError(IErrorCode.EMPTY_INPUT, "Inputs are empty", IStatusCode.BAD_REQUEST);
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError(IErrorCode.USER_NOT_FOUND, "No User found", IStatusCode.NOT_FOUND);
  const isValid = await passwordIsValid(password, user.password);
  if (!isValid) throw new AppError(IErrorCode.INVALID_PASSWORD, "Password is invalid", IStatusCode.BAD_REQUEST);
  const token = getAuthenticatedToken(user.name, user.email);
  if (!token) throw new AppError(IErrorCode.CANNOT_GET_JWT_TOKEN, "Cannot get User Token", IStatusCode.NOT_FOUND);
  res.status(IStatusCode.OK).json({ token });
};

export const login = tryCatch(loginController);
export const register = tryCatch(registerController);
