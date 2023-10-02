import { IError } from "../../../apis/IError";
import { IUser } from "../../../apis/IUser";

export let initialState: IUser & {
  confirmPassword: string;
  error: IError | undefined;
  form: { passwordIsHidden: boolean; emailIsValid: boolean };
} = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  error: undefined,
  form: {
    passwordIsHidden: true,
    emailIsValid: false,
  },
};

const getDefaultState = () => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
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

const actionHandlers = Object.fromEntries(
  Object.values(IAction).map((action) => [action, (_: IState, payload: IState) => ({ ...payload })])
);

export function reducer(state: IState, { type, payload }: { type: IAction; payload: IState }): IState {
  const actionHandler = actionHandlers[type] || ((state) => state);
  return actionHandler(state, payload);
}
