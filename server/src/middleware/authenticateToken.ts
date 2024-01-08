import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { IErrorCode } from "../types/IErrorCode.js";
import { IStatusCode } from "../types/IStatusCode.js";

/**
 * This function is used to authenticate user token send from the client side
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @param {NextFunction} next - Next function
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null || !process.env.JWT_SECRET) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) throw new AppError(IErrorCode.UNAUTHORIZED, "Unauthorized", IStatusCode.UNAUTHORIZED);
    next();
  });
};
