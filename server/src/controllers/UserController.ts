import { Request, Response } from "express";
import { encryptPassword, getAuthenticatedToken, passwordIsValid } from "../utils/password.js";
import { User } from "../models/User.js";
import { IUser } from "../types/IUser.js";
import { IStatusCode } from "../types/IStatusCode.js";
import { tryCatch } from "../utils/tryCatch.js";
import { AppError } from "../utils/AppError.js";
import { IErrorCode } from "../types/IErrorCode.js";

export const register = async (req: Request<{}, any, IUser>, res: Response<{ status: IStatusCode }>) => {
  const { name, email, password } = req.body;
  try {
    const encryptedPassword = await encryptPassword(password);
    await User.create({ name, email, password: encryptedPassword });
    res.json({ status: IStatusCode.CREATED });
  } catch (error) {
    res.json({ status: IStatusCode.NOT_FOUND });
  }
};

/**
 * This function is used to log user
 * @param {Request<{}, any, Pick<IUser, "email" | "password">>} req - Request which contain user email and user password
 * @param {Response<{ token: string }>} res - Response which contain the Status code and the user token
 * @returns {void}
 */
export const loginController = async (
  req: Request<{}, any, Pick<IUser, "email" | "password">>,
  res: Response<{ token: string }>
): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError(IErrorCode.EMPTY_INPUT, "Inputs are empty", IStatusCode.BAD_REQUEST);
  const user = await User.findOne({ email });
  if (!user) throw new AppError(IErrorCode.USER_NOT_FOUND, "No User found", IStatusCode.NOT_FOUND);
  const isValid = await passwordIsValid(password, user.password);
  if (!isValid) throw new AppError(IErrorCode.INVALID_PASSWORD, "Password is invalid", IStatusCode.BAD_REQUEST);
  const token = getAuthenticatedToken(user.name, user.email);
  if (!token) throw new AppError(IErrorCode.CANNOT_GET_JWT_TOKEN, "Cannot get User Token", IStatusCode.NOT_FOUND);
  res.status(IStatusCode.OK).json({ token });
};

export const login = tryCatch(loginController);
