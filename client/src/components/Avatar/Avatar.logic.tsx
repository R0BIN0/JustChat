import { useReducer } from "react";
import { reducer, initialState, IAction } from "./Avatar.reducer";
import { AVATAR_LENGTH } from "../../const/const";

export const useAvatar = (props: { handleAvatar: (idx: number) => void }) => {
  // States
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  const handleGoNext = () => {
    if (state.currentIdx >= AVATAR_LENGTH - 2) return;
    const currentIdx = state.currentIdx + 1;
    dispatch({ type: IAction.SET_CURRENT_INDEX, payload: { ...state, currentIdx } });
    props.handleAvatar(currentIdx + 2);
  };

  const handleGoBack = () => {
    if (state.currentIdx < 0) return;
    const currentIdx = state.currentIdx - 1;
    dispatch({ type: IAction.SET_CURRENT_INDEX, payload: { ...state, currentIdx } });
    props.handleAvatar(currentIdx + 2);
  };

  return { ...state, handleGoNext, handleGoBack };
};
