import { IError } from "../../apis/IError";

export let initialState: { isLoaded: boolean; hasError: IError | undefined } = {
  isLoaded: false,
  hasError: undefined,
};

const getDefaultState = () => ({
  isLoaded: false,
  hasError: undefined,
});

export type IState = typeof initialState;

export enum IAction {
  TOGGLE_IS_LOADED = "toggle_is_loaded",
  HANDLE_ERROR = "handle_error",
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
