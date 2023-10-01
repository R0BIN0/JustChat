import { IErrorCode } from "./IErrorCode.js";
import { IStatusCode } from "./IStatusCode.js";

export type IError = {
  message: string;
  code: IErrorCode;
  status: IStatusCode;
};
