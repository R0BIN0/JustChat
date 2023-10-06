import { useReducer, useCallback, useEffect } from "react";
import { reducer, initialState, IAction, IState } from "./Home.reducer";
export const useHome = () => {
  // State
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  // UseEffect

  useEffect(() => {
    getFilteredUsers();
  }, [state.search]);

  /**
   * This function is used to fill state with input data to find user
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input event
   * @returns {void}
   */
  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const payload: IState = { ...state, search: e.target.value };
    dispatch({ type: IAction.UPDATE_INPUT, payload });
  }, []);

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
