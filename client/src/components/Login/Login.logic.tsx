import React, { useCallback, useReducer, useEffect } from "react";
import { reducer, initialState, IAction, componentIsUnmounting } from "./Login.reducer";
import { useDispatch } from "react-redux";
import { IAppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../redux/reducers/authReducer";
import { useMutation } from "react-query";
import { login } from "../../apis/actions/UserAction";

export const useLogin = () => {
  // Services
  const dispatchCtx = useDispatch<IAppDispatch>();
  const navigate = useNavigate();

  // State
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  const mutation = useMutation(async () => login({ email: state.email, password: state.password }), {
    onSuccess: (res) => handleSuccess(res.token),
    onError: (err: string) => handleError(err),
  });

  useEffect(() => {
    return componentIsUnmounting();
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
   * This function is used to handle succes of the login request.
   * @param {string} token - Token that we received to authenticate user
   * @returns {void}
   */
  const handleSuccess = useCallback((token: string): void => {
    console.log(token, "TOKEN");
    dispatchCtx(setAuth({ isAuthenticated: true, token }));
    console.log("je m'en vais");
    navigate("/Home");
  }, []);

  /**
   * This function is used to handle error of the login request.
   * @param {string} err - Error we received from the server
   * @returns {void}
   */
  const handleError = useCallback((err: string): void => {
    const payload = { ...state, error: { message: err } };
    dispatch({ type: IAction.UPDATE_ERROR_MESSAGE, payload });
    dispatchCtx(setAuth({ isAuthenticated: false, token: undefined }));
  }, []);

  /**
   * This function is used to handle submit the login form.
   * @returns {void}
   */
  const handleSubmitAsync = useCallback((e: React.SyntheticEvent): void => {
    e.preventDefault();
    mutation.mutate();
  }, []);

  return { state, dispatch, handleInput, handleSubmitAsync, mutation };
};
