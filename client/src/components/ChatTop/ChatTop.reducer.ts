export let initialState: { usersDialogIsOpen: boolean } = {
  usersDialogIsOpen: false,
};

const getDefaultState = () => ({
  usersDialogIsOpen: false,
});

export type IState = typeof initialState;

export enum IAction {
  TOGGLE_USER_DIALOG = "toggle_user_dialog",
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
