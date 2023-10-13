import { IError } from "../../apis/IError";
import { IHomeRef } from "../Refs/IHomeRef";

export type IUserList = {
  onRef: (ref: IHomeRef) => void;
  toggleIsLoaded: () => void;
  handleError: (err: IError) => void;
};
