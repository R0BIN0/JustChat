import { IError } from "../../apis/IError";

export type IInputError = {
  show: boolean;
  error: IError | undefined;
};
