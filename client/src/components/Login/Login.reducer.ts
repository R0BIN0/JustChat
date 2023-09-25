import { IUser } from "IUser";

export const initialState: Pick<IUser, "email" | "password"> = {
    email: "",
    password: ""
};

type IState = typeof initialState;

export enum IAction {
    UPDATE_INPUT = "update_input"
}

export function reducer(
    state: IState,
    action: { type: IAction.UPDATE_INPUT; payload: any }
): IState {
    const { type, payload } = action;
    switch (type) {
        case IAction.UPDATE_INPUT:
            state = payload;
            return state;
        default:
            return state;
    }
}
