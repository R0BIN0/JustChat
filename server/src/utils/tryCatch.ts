import { NextFunction, Request, Response } from "express";

export const tryCatch =
  (controller: Function) =>
  async (
    req: Request<{}, any, unknown>,
    res: Response<unknown>,
    next: NextFunction
  ) => {
    try {
      await controller(req, res);
    } catch (error) {
      return next(error);
    }
  };
