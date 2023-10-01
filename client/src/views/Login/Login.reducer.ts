import { IError } from "../../apis/IError";
import { IUser } from "../../apis/IUser";

export let initialState: Pick<IUser, "email" | "password"> & {
  error: IError | undefined;
  form: { passwordIsHidden: boolean; emailIsValid: boolean };
} = {
  email: "",
  password: "",
  error: undefined,
  form: {
    passwordIsHidden: true,
    emailIsValid: false,
  },
};

const getDefaultState = () => ({
  email: "",
  password: "",
  error: undefined,
  form: {
    passwordIsHidden: true,
    emailIsValid: false,
  },
});

export type IState = typeof initialState;

export enum IAction {
  UPDATE_INPUT = "update_input",
  TOGGLE_PASSWORD = "toggle_password",
  UPDATE_ERROR_MESSAGE = "update_error_message",
  EMAIL_VALIDATION = "email_validation",
}

export const componentIsUnmounting = () => {
  initialState = getDefaultState();
};

export function reducer(state: IState, action: { type: IAction; payload: IState }): IState {
  const { type, payload } = action;
  switch (type) {
    case IAction.UPDATE_INPUT:
      return { ...payload };
    case IAction.TOGGLE_PASSWORD:
      return { ...payload };
    case IAction.UPDATE_ERROR_MESSAGE:
      return { ...payload };
    case IAction.EMAIL_VALIDATION:
      return { ...payload };
    default:
      return state;
  }
}
