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
 * @returns {Promise<void>}
 */
export const registerController = async (
  req: Request<{}, any, IUser & { confirmPassword: string }>,
  res: Response<{ token: string; user: IUserDTO }>
): Promise<void> => {
  const { name, email, password, confirmPassword, pictureId } = req.body;
  if (!name || !email || !password || !confirmPassword)
    throw new AppError(IErrorCode.EMPTY_INPUT, "Inputs are empty", IStatusCode.BAD_REQUEST);
  const nameIsAlreadyUsed = await User.findOne({ name });
  if (nameIsAlreadyUsed) throw new AppError(IErrorCode.NAME_ALREADY_USED, "This name is already used", IStatusCode.BAD_REQUEST);
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
 * @returns {Promise<void>}
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
 * This function is used to get unique user from the DB
 * @param {Request<{}, any, Pick<IUser, "_id">>} req - Request which contain userId to find user
 * @param {Response<{ user: IUser }>} res - User found in the Database
 * @returns {Promise<void>}
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

/**
 * This function is used to update user account
 * @param {Request<{}, any, Pick<IUser, "_id" | "name" | "email | pictureId">>} req - Request which contain user _id, name, email and pictureId
 * @param {Response<{ success: boolean }>} res - Response which contain the success of the request (to trigger react-hook-form success)
 * @returns {Promise<void>}
 */
export const updateUserController = async (
  req: Request<{}, any, Pick<IUser, "_id" | "name" | "email" | "pictureId">>,
  res: Response<{ success: boolean }>
): Promise<void> => {
  const { _id, name, email, pictureId } = req.body;
  if (!email || !name) throw new AppError(IErrorCode.EMPTY_INPUT, "Inputs are empty", IStatusCode.BAD_REQUEST);
  const nameIsAlreadyUsed = await User.findOne({ name });
  if (nameIsAlreadyUsed && nameIsAlreadyUsed.id !== _id)
    throw new AppError(IErrorCode.NAME_ALREADY_USED, "This name is already used", IStatusCode.BAD_REQUEST);
  const emailIsAlreadyUsed = await User.findOne({ email });
  if (emailIsAlreadyUsed && emailIsAlreadyUsed.id !== _id)
    throw new AppError(IErrorCode.SAME_EMAIL, "This email is already used", IStatusCode.BAD_REQUEST);

  const user = await User.findOneAndUpdate({ _id }, { name, email, pictureId });
  if (!user) throw new AppError(IErrorCode.USER_NOT_FOUND, "No User found", IStatusCode.NOT_FOUND);
  res.status(IStatusCode.OK).json({ success: true });
};

/**
 * This function is used to delete user account
 * @param {Request<{}, any, Pick<IUser, "_id">>} req - Request which contain user _id
 * @param {Response<{ success: boolean }>} res - Response which contain the success of the request (to trigger react-hook-form success)
 * @returns {Promise<void>}
 */
export const deleteUserController = async (
  req: Request<{}, any, Pick<IUser, "_id">>,
  res: Response<{ success: boolean }>
): Promise<void> => {
  const { _id } = req.body;
  await User.findOneAndDelete({ _id });
  res.status(IStatusCode.OK).json({ success: true });
};

export const register = tryCatch(registerController);
export const login = tryCatch(loginController);
export const getUserById = tryCatch(getUserByIdController);
export const updateUser = tryCatch(updateUserController);
export const deleteUser = tryCatch(deleteUserController);
