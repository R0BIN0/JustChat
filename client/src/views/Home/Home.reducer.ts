import { IUser } from "../../apis/IUser";
import { IError } from "../../apis/IError";

export let initialState: { users: { data: IUser[]; isLoading: boolean; error: IError | undefined }; search: string } = {
  users: {
    data: [],
    isLoading: true,
    error: undefined,
  },
  search: "",
};

const getDefaultState = () => ({
  users: {
    data: [],
    isLoading: true,
    error: undefined,
  },
  search: "",
});

export type IState = typeof initialState;

export enum IAction {
  UPDATE_INPUT = "update_input",
  SEARCH_USER = "search_user",
  SET_QUERY = "set_query",
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
