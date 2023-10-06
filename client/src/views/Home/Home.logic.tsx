import { useReducer, useCallback, useEffect } from "react";
import { reducer, initialState, IAction, IState } from "./Home.reducer";
import { useQuery } from "react-query";
import { getAllUsers } from "../../apis/actions/UserAction";
import { IUser } from "../../apis/IUser";
import { IError } from "../../apis/IError";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
export const useHome = () => {
  // Services
  const userId = useSelector((s: IRootState) => s.user._id);

  // State
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  // Query
  useQuery("users", getAllUsers, {
    onSuccess: (res) => handleQuerySuccess(res),
    onError: (err: IError) => handleQueryError(err),
    enabled: state.users.isLoading,
    retry: 1,
  });

  // UseEffect
  useEffect(() => {
    getFilteredUsers();
  }, [state.search]);

  const handleQuerySuccess = useCallback((res: { users: IUser[] }) => {
    const allUsersWithoutMe = res.users.filter((item) => item._id !== userId);
    const payload: IState = { ...state, users: { data: allUsersWithoutMe, isLoading: false, error: undefined } };
    dispatch({ type: IAction.SET_QUERY, payload });
  }, []);

  const handleQueryError = useCallback((err: IError) => {
    const payload: IState = { ...state, users: { data: [], isLoading: false, error: err } };
    dispatch({ type: IAction.SET_QUERY, payload });
  }, []);

  /**
   * This function is used to fill state with input data to find user
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input event
   * @returns {void}
   */
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const payload: IState = { ...state, search: e.target.value };
    console.log(payload);
    dispatch({ type: IAction.UPDATE_INPUT, payload });
  };

  /**
   * This function is used to get user by search filter
   * @returns {void}
   */
  const getFilteredUsers = (): void => {
    // const allUsers = get data from query cache
    // const payload: IState = { ...state, users: };
    // dispatch({ type: IAction.SEARCH_USER, payload });
  };

  return { state, handleSearchInput };
};
