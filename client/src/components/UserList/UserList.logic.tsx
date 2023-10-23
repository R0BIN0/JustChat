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

export const useUserList = (props: IUserList) => {
  // Services
  const user = useSelector((s: IRootState) => s.user);
  const { webSocket, emitEvent } = useSelector((s: IRootState) => s.socket);

  // States
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  // Refs
  const usersRef = useRef<IUser[]>([]);

  // useQuery
  const {
    queryUsers: { data, isLoading, error },
    usersCache,
    mutate,
  } = useQueryCache();

  // UseEffect
  useEffect(() => {
    props.onRef({ handleSearchInput });
    return () => componentIsUnmounting();
  }, []);

  useEffect(() => {
    usersRef.current = data ?? [];
  }, [data]);

  useEffect(() => {
    if (!isLoading) props.toggleIsLoaded();
    if (error) props.handleError(error as IError);
  }, [isLoading, error]);

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
  }, [webSocket, usersCache]);

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
      const isHere = usersCache.find((item) => item._id === _id);
      if (isHere) {
        newArray = usersCache.map((item) => (item._id === _id ? { ...item, online: true } : item));
      } else {
        newArray = [...usersCache, userInfo];
      }
      mutate({ data: newArray, queryKey: [QUERY_KEY.USERS] });
    },
    [usersCache]
  );

  const onUserDisconnected = useCallback(
    (userInfo: IUser): void => {
      const { _id } = userInfo;
      if (_id === user._id) return;
      const newArray: IUser[] = usersCache.map((item) => (item._id === _id ? { ...item, online: false } : item));
      mutate({ data: newArray, queryKey: [QUERY_KEY.USERS] });
    },
    [usersCache]
  );

  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const payload: IState = { ...state, search: value };
    dispatch({ type: IAction.SEARCH_USER, payload });
  }, []);

  const isHide = (name: string) => !name.toLowerCase().includes(state.search.toLowerCase());

  return { state, user, isLoading, error, isHide, usersCache };
};
