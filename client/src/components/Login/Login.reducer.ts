/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "IUser";

export let initialState: Pick<IUser, "email" | "password"> & {
  error: { message: string };
} = {
  email: "",
  password: "",
  error: {
    message: "",
  },
};

type IState = typeof initialState;

export enum IAction {
  UPDATE_INPUT = "update_input",
  UPDATE_ERROR_MESSAGE = "update_error_message",
}

export const componentIsUnmounting = () => {
  initialState = { email: "", password: "", error: { message: "" } };
};

export function reducer(
  state: IState,
  action: { type: IAction; payload: IState }
): IState {
  const { type, payload } = action;
  switch (type) {
    case IAction.UPDATE_INPUT:
      return { ...payload };
    case IAction.UPDATE_ERROR_MESSAGE:
      return { ...payload };
    default:
      return state;
  }
}
