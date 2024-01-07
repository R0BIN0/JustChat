import { useEffect, useReducer } from "react";
import { reducer, initialState, IAction } from "./Avatar.reducer";
import { AVATAR_LENGTH } from "../../const/const";

export const useAvatar = (props: { handleAvatar: (idx: number) => void; defaultAvatar?: number }) => {
  // States
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  useEffect(() => {
    const currentIdx = props.defaultAvatar ? props.defaultAvatar - 2 : 0;
    dispatch({ type: IAction.SET_CURRENT_INDEX, payload: { ...state, currentIdx } });
  }, []);

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
