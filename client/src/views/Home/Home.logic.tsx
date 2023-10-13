import { useCallback, useReducer, useRef } from "react";
import { IHomeRef } from "../../types/Refs/IHomeRef";
import { reducer, initialState, IState, IAction } from "./Home.reducer";
import { IError } from "../../apis/IError";

export const useHome = () => {
  // State
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  // Refs
  const homeRef = useRef<IHomeRef>();

  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!homeRef.current) return;
    homeRef.current.handleSearchInput(e);
  }, []);

  const toggleIsLoaded = useCallback(() => {
    const payload: IState = { ...state, isLoaded: true };
    dispatch({ type: IAction.TOGGLE_IS_LOADED, payload });
  }, []);

  const handleError = useCallback((err: IError) => {
    const payload: IState = { ...state, hasError: err, isLoaded: true };
    dispatch({ type: IAction.HANDLE_ERROR, payload });
  }, []);

  return { state, homeRef, handleSearchInput, toggleIsLoaded, handleError };
};
