/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useReducer, useEffect, useRef } from "react";
import { reducer, initialState, IAction, componentIsUnmounting, IState } from "./Register.reducer";
import { useDispatch } from "react-redux";
import { IAppDispatch } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../../redux/reducers/authReducer";
import { IError } from "../../../apis/IError";
import { setUser } from "../../../redux/reducers/userReducer";
import { IUserDTO } from "../../../apis/IUserDTO";
import { useUserCache } from "../../../hooks/useQueryCache/useUserCache";

export const useRegister = () => {
  // Services
  const dispatchCtx = useDispatch<IAppDispatch>();
  const navigate = useNavigate();
  const { registerMutation } = useUserCache();

  // State
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  // Ref
  const avatarRef = useRef<number>(2);

  useEffect(() => {
    window.addEventListener("keypress", submitWithKeypress);
    return () => {
      window.removeEventListener("keypress", submitWithKeypress);
      componentIsUnmounting();
    };
  }, []);

  useEffect(() => {
    emailIsValid();
  }, [state.email, state.form.emailIsValid]);

  /**
   * This function is used to submit form by pressing Enter key
   * @param {KeyboardEvent} e - Keyboard event
   * @returns {void}
   */
  const submitWithKeypress = (e: KeyboardEvent): void => {
    const { key } = e;
    if (key !== "Enter") return;
    handleSubmitAsync();
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
   * This function is used to handle avatar selection in <Avatar /> Component
   * @param {number} idx - Index of selected avatar
   * @returns {void}
   */
  const handleAvatar = useCallback((idx: number): void => {
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
   * This function is used to toggle password to shown or hide password
   * @returns {void}
   */
  const togglePassword = (): void => {
    const toggle = !state.form.passwordIsHidden;
    const payload: IState = { ...state, form: { ...state.form, passwordIsHidden: toggle } };
    dispatch({ type: IAction.TOGGLE_PASSWORD, payload });
  };

  /**
   * This function is used to handle submit the register form.
   * @param {React.SyntheticEvent} e - JS Event
   * @returns {void}
   */
  const handleSubmitAsync = (e?: React.SyntheticEvent): void => {
    e?.preventDefault();
    if (!state.name || !state.password || !state.form.emailIsValid || state.password !== state.confirmPassword) return;
    registerMutation.mutate(
      {
        name: state.name,
        email: state.email,
        password: state.password,
        confirmPassword: state.confirmPassword,
        pictureId: avatarRef.current,
      },
      {
        onSuccess,
        onError,
      }
    );
  };

  /**
   * This function is used to handle succes of the register request.
   * @param {string} token - Token that we received to authenticate user
   * @returns {void}
   */
  const onSuccess = useCallback((data: { token: string; user: IUserDTO }): void => {
    const { token, user } = data;
    dispatchCtx(setAuth({ isAuthenticated: true, token }));
    dispatchCtx(setUser(user));
    navigate("/home");
  }, []);

  /**
   * This function is used to handle error of the register request.
   * @param {IError} error - Error with message/errorCode/statusCode
   * @returns {void}
   */
  const onError = (error: IError): void => {
    const payload: IState = {
      ...state,
      error,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      form: { ...state.form, emailIsValid: false },
    };
    dispatch({ type: IAction.UPDATE_ERROR_MESSAGE, payload });
    dispatchCtx(setAuth({ isAuthenticated: false, token: undefined }));
  };

  return {
    ...state,
    dispatch,
    handleInput,
    togglePassword,
    handleSubmitAsync,
    isLoading: registerMutation.isLoading,
    handleAvatar,
  };
};
