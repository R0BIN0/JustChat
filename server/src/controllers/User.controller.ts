import { Request, Response } from "express";
import {
  encryptPassword,
  getAuthenticatedToken,
  passwordIsValid,
} from "../utils/password.js";
import { User } from "../models/User.js";
import { IUser } from "../../../shared-types/IUser.js";
import { IStatusCode } from "../../../shared-types/IStatusCode.js";

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
    res.json({ status: IStatusCode.BAD_REQUEST });
  }
};

export const login = async (
  req: Request<{}, any, Pick<IUser, "email" | "password">>,
  res: Response<{ status: IStatusCode; user: string }>
) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("no user found");
    const isValid = await passwordIsValid(password, user.password);
    if (!isValid) throw new Error("not valid");
    const token = getAuthenticatedToken(user.name, user.email);
    if (!token) throw new Error("cannot get token");
    res.json({ status: IStatusCode.OK, user: token });
  } catch (error) {
    res.json({ status: IStatusCode.NOT_FOUND, user: "" });
  }
};
