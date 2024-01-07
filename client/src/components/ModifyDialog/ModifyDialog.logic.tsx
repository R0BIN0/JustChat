import { useCallback, useEffect, useReducer, useRef } from "react";
import { reducer, initialState, IAction, IState } from "./ModifyDialog.reducer";
import { useDispatch, useSelector } from "react-redux";
import { IAppDispatch, IRootState } from "../../redux/store";
import { useUserCache } from "../../hooks/useQueryCache/useUserCache";
import { setDialog } from "../../redux/reducers/dialogReducer";
import { setUser } from "../../redux/reducers/userReducer";
import { ISocketEvent } from "../../apis/ISocketEvent";
import { IError } from "../../apis/IError";
import { IDialogs } from "../../types/Dialogs/IDialogs";

export const useModifyDialog = () => {
  // Services
  const user = useSelector((s: IRootState) => s.user);
  const { emitEvent } = useSelector((s: IRootState) => s.socket);
  const { updateUserMutation } = useUserCache();
  const dispatchCtx = useDispatch<IAppDispatch>();

  // State
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  // Ref
  const avatarRef = useRef<number>(user.pictureId);

  useEffect(() => {
    const payload: IState = { ...state, name: user.name, email: user.email };
    dispatch({ type: IAction.UPDATE_INPUT, payload });
  }, [user.name, user.email]);

  useEffect(() => {
    emailIsValid();
  }, [state.email, state.form.emailIsValid]);

  const handleAvatar = useCallback((idx: number) => {
    avatarRef.current = idx;
  }, []);

  /**
   * This function is used to fill state with input data that user insert.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input event
   * @returns {void}
   */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const target = e.target.getAttribute("id");
    if (!target) return;
    const payload = { ...state, [target]: e.target.value };
    dispatch({ type: IAction.UPDATE_INPUT, payload });
  };

  /**
   * This function is used to verify if the email input is correctly filled
   * @returns {void}
   */
  const emailIsValid = (): void => {
    const currentState = state.form.emailIsValid;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = Boolean(emailRegex.test(state.email));
    if (currentState === isValid) return;
    const payload: IState = { ...state, form: { ...state.form, emailIsValid: isValid } };
    dispatch({ type: IAction.EMAIL_VALIDATION, payload });
  };

  /**
   * This function is used to handle submit the register form.
   * @param {React.SyntheticEvent} e - JS Event
   * @returns {void}
   */
  const handleSubmitAsync = async (e?: React.SyntheticEvent): Promise<void> => {
    e?.preventDefault();
    const data = {
      _id: user._id,
      name: state.name,
      email: state.email,
      pictureId: avatarRef.current,
    };
    updateUserMutation.mutate(data, {
      onSuccess: handleUpdateSuccess,
      onError: handleUpdateError,
    });
  };

  const handleUpdateSuccess = () => {
    dispatchCtx(setDialog({ isOpen: undefined, data: undefined }));
    const newUser = { ...user, name: state.name, email: state.email, pictureId: avatarRef.current };
    dispatchCtx(setUser(newUser));
    emitEvent(ISocketEvent.USER_UDPATE, newUser);
  };

  const handleUpdateError = (error: IError) => {
    const payload: IState = { ...state, error };
    dispatch({ type: IAction.UPDATE_ERROR_MESSAGE, payload });
  };

  const handleDeleteDialog = useCallback((): void => {
    dispatchCtx(setDialog({ isOpen: IDialogs.DELETE, data: undefined }));
  }, []);

  return { ...state, handleAvatar, avatarRef, handleSubmitAsync, handleInput, updateUserMutation, handleDeleteDialog };
};
