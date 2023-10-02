import { NextFunction, Request, Response } from "express";
import { IStatusCode } from "../types/IStatusCode.js";
import { AppError } from "../utils/AppError.js";
import { IErrorCode } from "../types/IErrorCode.js";

export const errorHandler = (
  error: any,
  req: Request<{}, any, unknown>,
  res: Response<unknown>,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.errCode,
        status: error.statusCode,
      },
    });
  }

  if (error.code === 11000) {
    return res.status(IStatusCode.BAD_REQUEST).json({
      error: {
        message: error.message,
        code: IErrorCode.SAME_EMAIL,
        status: IStatusCode.BAD_REQUEST,
      },
    });
  }

  if (error.name === "ValidationError") {
    return res.status(IStatusCode.BAD_REQUEST).json({
      error: {
        message: error.message,
        code: IErrorCode.WRONG_MAIL_FORMAT,
        status: IStatusCode.BAD_REQUEST,
      },
    });
  }

  return res.status(IStatusCode.BAD_REQUEST).json({
    error: {
      message: error.message,
      code: IErrorCode.UNEXCPECTED_ERROR,
      status: IStatusCode.BAD_REQUEST,
    },
  });
};
