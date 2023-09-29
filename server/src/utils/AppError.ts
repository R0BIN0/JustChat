import { IErrorCode } from "../types/IErrroCode.js";
import { IStatusCode } from "../types/IStatusCode.js";

export class AppError extends Error {
  errCode: IErrorCode;
  statusCode: IStatusCode;
  constructor(errCode: IErrorCode, message: string, statusCode: IStatusCode) {
    super(message);
    this.errCode = errCode;
    this.statusCode = statusCode;
  }
}
