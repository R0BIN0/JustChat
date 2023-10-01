import React, { useCallback, useReducer, useEffect } from "react";
import { reducer, initialState, IAction, componentIsUnmounting, IState } from "./Login.reducer";
import { useDispatch } from "react-redux";
import { IAppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../redux/reducers/authReducer";
import { useMutation } from "react-query";
import { login } from "../../apis/actions/UserAction";
import { IError } from "../../apis/IError";

export const useLogin = () => {
  // Services
  const dispatchCtx = useDispatch<IAppDispatch>();
  const navigate = useNavigate();

  // State
  const [state, dispatch] = useReducer(reducer, { ...initialState });

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

  const mutation = useMutation(async () => login({ email: state.email, password: state.password }), {
    onSuccess: (res) => handleSuccess(res.token),
    onError: (err: IError) => handleError(err),
  });

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
   * This function is used to handle succes of the login request.
   * @param {string} token - Token that we received to authenticate user
   * @returns {void}
   */
  const handleSuccess = useCallback((token: string): void => {
    dispatchCtx(setAuth({ isAuthenticated: true, token }));
    navigate("/Home");
  }, []);

  /**
   * This function is used to handle error of the login request.
   * @param {IError} error - Error with message/errorCode/statusCode
   * @returns {void}
   */
  const handleError = (error: IError): void => {
    const payload: IState = {
      ...state,
      error,
      email: "",
      password: "",
      form: { ...state.form, emailIsValid: false },
    };
    dispatch({ type: IAction.UPDATE_ERROR_MESSAGE, payload });
    dispatchCtx(setAuth({ isAuthenticated: false, token: undefined }));
  };

  /**
   * This function is used to handle submit the login form.
   * @param {React.SyntheticEvent} e - JS Event
   * @returns {void}
   */
  const handleSubmitAsync = (e?: React.SyntheticEvent): void => {
    e?.preventDefault();
    if (!state.email || !state.password || !state.form.emailIsValid) return;
    mutation.mutate();
  };

  return { state, dispatch, handleInput, togglePassword, handleSubmitAsync, mutation };
};
