import { IUser } from "../../apis/IUser";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { parseSocketEvent } from "../../utils/parseSocketEvent";
import { ISocketEvent } from "../../apis/ISocketEvent";
import { reducer, initialState, IState, IAction, componentIsUnmounting } from "./UserList.reducer";
import { IUserList } from "../../types/Users/IUserList";
import { IError } from "../../apis/IError";
import { useQueryCache } from "../../hooks/useQueryCache/useQueryCache";
import { QUERY_KEY } from "../../hooks/useQueryCache/queryKey";
import { useUserCache } from "../../hooks/useQueryCache/useUserCache";

export const useUserList = (props: IUserList) => {
  // Services
  const user = useSelector((s: IRootState) => s.user);
  const { webSocket, emitEvent } = useSelector((s: IRootState) => s.socket);

  // States
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  // Refs
  const usersRef = useRef<IUser[]>([]);

  // useQuery
  const { mutate } = useQueryCache();
  const { queryUsers } = useUserCache();

  // UseEffect
  useEffect(() => {
    props.onRef({ handleSearchInput });
    return () => componentIsUnmounting();
  }, []);

  useEffect(() => {
    usersRef.current = queryUsers.data ?? [];
  }, [queryUsers.data]);

  useEffect(() => {
    if (!queryUsers.isLoading) props.toggleIsLoaded();
    if (queryUsers.error) props.handleError(queryUsers.error as IError);
  }, [queryUsers.isLoading, queryUsers.error]);

  useEffect(() => {
    if (!webSocket) return;
    setUserIsConnected();
    webSocket.addEventListener("message", onEvent);
    return () => {
      webSocket.removeEventListener("message", onEvent);
    };
  }, [webSocket]);

  useEffect(() => {
    if (!webSocket) return;
    webSocket.addEventListener("message", onEvent);
    return () => {
      webSocket.removeEventListener("message", onEvent);
    };
  }, [webSocket, queryUsers.data]);

  const setUserIsConnected = useCallback(() => {
    if (!user._id) return;
    emitEvent(ISocketEvent.USER_IS_CONNECTED, user);
  }, []);

  const onEvent = (event: unknown) => {
    const { type, data: dataEvent } = parseSocketEvent(event);
    switch (type) {
      case ISocketEvent.USER_IS_CONNECTED:
        onUserConnected(dataEvent as IUser);
        break;
      case ISocketEvent.USER_IS_DISCONNECTED:
        onUserDisconnected(dataEvent as IUser);
        break;
      default:
        break;
    }
  };

  const onUserConnected = useCallback(
    (userInfo: IUser): void => {
      let newArray: IUser[] = [];
      const { _id } = userInfo;
      if (_id === user._id) return;
      const isHere = queryUsers.data.find((item) => item._id === _id);
      if (isHere) {
        newArray = queryUsers.data.map((item) => (item._id === _id ? { ...item, online: true } : item));
      } else {
        newArray = [...queryUsers.data, userInfo];
      }
      mutate({ data: newArray, queryKey: [QUERY_KEY.USERS] });
    },
    [queryUsers.data]
  );

  const onUserDisconnected = useCallback(
    (userInfo: IUser): void => {
      const { _id } = userInfo;
      if (_id === user._id) return;
      const newArray: IUser[] = queryUsers.data.map((item) => (item._id === _id ? { ...item, online: false } : item));
      mutate({ data: newArray, queryKey: [QUERY_KEY.USERS] });
    },
    [queryUsers.data]
  );

  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const payload: IState = { ...state, search: value };
    dispatch({ type: IAction.SEARCH_USER, payload });
  }, []);

  const isHide = (name: string) => !name.toLowerCase().includes(state.search.toLowerCase());

  return { state, user, isLoading: queryUsers.isLoading, error: queryUsers.error, isHide, users: queryUsers.data };
};
