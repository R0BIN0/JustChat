export let initialState: { scroll: { percentage: number } } = {
  scroll: {
    percentage: 100,
  },
};

const getDefaultState = () => ({
  scroll: {
    percentage: 100,
  },
});

export type IState = typeof initialState;

export enum IAction {
  SET_SCROLL_PERCENTAGE = "set_scroll_percentage",
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
