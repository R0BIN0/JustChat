import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { useEffect, useReducer, useCallback } from "react";
import { reducer, initialState, IAction, IState } from "./ChatTop.reducer";

export const useChatTop = () => {
  const { contact } = useSelector((s: IRootState) => s.chat);

  // State
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  useEffect(() => {
    closeModal();
  }, [contact._id]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const closeModal = useCallback(() => {
    const payload: IState = { ...state, usersDialogIsOpen: false };
    dispatch({ type: IAction.TOGGLE_USER_DIALOG, payload });
  }, []);

  const openModal = useCallback(() => {
    const payload: IState = { ...state, usersDialogIsOpen: true };
    dispatch({ type: IAction.TOGGLE_USER_DIALOG, payload });
  }, []);

  const onResize = () => {
    if (window.innerWidth >= 850) closeModal();
  };

  return { state, contact, openModal, closeModal };
};
