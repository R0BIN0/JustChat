import { IUserDTO } from "../../apis/IUserDTO";

export let initialState: { users: IUserDTO[]; search: string } = {
  users: [],
  search: "",
};

const getDefaultState = () => ({
  users: [],
  search: "",
});

export type IState = typeof initialState;

export enum IAction {
  UPDATE_INPUT = "update_input",
  SEARCH_USER = "search_user",
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
