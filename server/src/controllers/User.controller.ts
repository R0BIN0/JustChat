import { Request, Response } from "express";
import {
  encryptPassword,
  getAuthenticatedToken,
  passwordIsValid,
} from "../utils/password.js";
import { User } from "../models/User.js";
import { IUser } from "../types/IUser.js";
import { IStatusCode } from "../types/IStatusCode.js";

export const register = async (
  req: Request<{}, any, IUser>,
  res: Response<{ status: IStatusCode }>
) => {
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
 * @param {Response<{ user: string }>} res - Response which contain the Status code and the user token
 * @returns {void}
 */
export const login = async (
  req: Request<{}, any, Pick<IUser, "email" | "password">>,
  res: Response<{ user: string } | { error: unknown }>
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("no user found");
    const isValid = await passwordIsValid(password, user.password);
    if (!isValid) throw new Error("not valid");
    const token = getAuthenticatedToken(user.name, user.email);
    if (!token) throw new Error("cannot get token");
    res.status(IStatusCode.OK).json({ user: token });
  } catch (error) {
    res.status(IStatusCode.NOT_FOUND).json({ error: "SOMETING BAD" });
  }
};
