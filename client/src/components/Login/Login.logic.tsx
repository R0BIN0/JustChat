import React, { useCallback, useReducer } from "react";
import { reducer, initialState, IAction } from "./Login.reducer";
import { useDispatch } from "react-redux";
import { IAppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../redux/reducers/authReducer";
import { useMutation } from "react-query";
import { login } from "../../apis/actions/User.action";

export const useLogin = () => {
    // Services
    const dispatchCtx = useDispatch<IAppDispatch>();
    const navigate = useNavigate();

    // State
    const [state, dispatch] = useReducer(reducer, { ...initialState });

    const mutation = useMutation(
        async () => login({ email: state.email, password: state.password }),
        {
            onSuccess: (res) => handleSuccess(res.user),
            onError: (err: unknown) => handleError(err)
        }
    );

    /**
     * This function is used to fill state with input data that user insert.
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input event
     * @returns {void}
     */
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const target = e.target.getAttribute("id");
        if (!target) return;
        const updatedValue = { ...state, [target]: e.target.value };
        dispatch({ type: IAction.UPDATE_INPUT, payload: updatedValue });
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
     * @param {unknown} err - Error we received from the server
     * @returns {void}
     */
    const handleError = useCallback((err: unknown): void => {
        dispatchCtx(setAuth({ isAuthenticated: false, token: undefined }));
        console.error("Une erreur est survenue.");
    }, []);

    /**
     * This function is used to handle submit the login form.
     * @returns {void}
     */
    const handleSubmitAsync = useCallback((): void => mutation.mutate(), []);

    return { state, dispatch, handleInput, handleSubmitAsync, mutation };
};
