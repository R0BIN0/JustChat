/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useReducer, useRef } from "react";
import { IState, componentIsUnmounting, reducer, initialState, IAction } from "./Dropdown.reducer";
import { useDispatch, useSelector } from "react-redux";
import { IAppDispatch, IRootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/reducers/userReducer";
import { setAuth } from "../../redux/reducers/authReducer";

export const useDropdown = () => {
  // Services
  const user = useSelector((s: IRootState) => s.user);
  const navigate = useNavigate();
  const dispatchCtx = useDispatch<IAppDispatch>();

  // State
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  // Refs
  const dropDownContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => componentIsUnmounting();
  }, []);

  useEffect(() => {
    window.addEventListener("click", preventOutsideClick);
    return () => window.removeEventListener("click", preventOutsideClick);
  }, [state]);

  const preventOutsideClick = (e: MouseEvent) => {
    if (!state.isActive) return;
    if (!dropDownContainer.current) return;
    if (e.target instanceof Node && !dropDownContainer.current.contains(e.target)) toggleIsActive();
  };

  const toggleIsActive = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    const payload: IState = { ...state, isActive: !state.isActive };
    dispatch({ type: IAction.TOGGLE_IS_ACTIVE, payload });
  };

  const handleDisconnect = useCallback((): void => {
    sessionStorage.clear();
    dispatchCtx(
      setUser({
        name: "",
        email: "",
        pictureId: 1,
        online: false,
        _id: "",
      })
    );
    dispatchCtx(
      setAuth({
        isAuthenticated: false,
        token: "",
      })
    );
    navigate("/");
  }, []);

  const openEditDialog = (): void => {};

  return { ...state, toggleIsActive, openEditDialog, handleDisconnect, dropDownContainer, user };
};
