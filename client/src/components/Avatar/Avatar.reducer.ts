export let initialState: { currentIdx: number } = {
  currentIdx: 0,
};

const getDefaultState = () => ({
  currentIdx: 0,
});

export type IState = typeof initialState;

export enum IAction {
  SET_CURRENT_INDEX = "set_current_index",
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
