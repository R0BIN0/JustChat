import { useCallback, useEffect, useState } from "react";
import { IUserList } from "../../types/Users/IUserList";
import { ISocketEvent } from "../../apis/ISocketEvent";
import { parseSocketEvent } from "../../utils/parseSocketEvent";
import { IUser } from "../../apis/IUser";
import { IRootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { queryClient } from "../../main";
import { QUERY_KEY } from "../../hooks/useQueryCache/queryKey";
import { getIndexFromNumber } from "../../utils/getIndexFromNumber";
import { FETCH_USERS_LIMIT } from "../../const/const";
import { IQueryUser } from "../../types/Query/IQueryUsers";
import { useUsersCache } from "../../hooks/useQueryCache/useUsersCache";

export const useUserList = (props: IUserList) => {
  const { webSocket, emitEvent } = useSelector((s: IRootState) => s.socket);
  const user = useSelector((s: IRootState) => s.user);

  // States
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    queryUsers: { hasNextPage, data, fetchNextPage, isFetching },
    removeUnusedQueries,
  } = useUsersCache(searchTerm);

  const users = data?.pages.map((p) => p.users.map((u) => u)).flat() ?? [];

  useEffect(() => {
    props.onRef({ handleSearchInput });
  }, []);

  useEffect(() => {
    if (!isFetching || hasNextPage) hasScrollbar();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasNextPage]);

  useEffect(() => {
    if (!webSocket) return;
    setUserIsConnected();
  }, [webSocket]);

  useEffect(() => {
    if (!webSocket) return;
    webSocket.addEventListener("message", onEvent);
    return () => webSocket.removeEventListener("message", onEvent);
  }, [webSocket, users]);

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetching) return;
    const scrollTop = document.documentElement.scrollTop;
    const offsetHeight = document.documentElement.offsetHeight;
    const innerHeight = window.innerHeight;
    if (scrollTop + innerHeight >= offsetHeight) fetchNextPage();
  }, [hasNextPage, isFetching]);

  /**
   * This function is used to update "searchTerm" query to search user in the database.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input event
   * @returns {void}
   */
  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchTerm(value);
    removeUnusedQueries();
  }, []);

  /**
   * This function determine if scrollbar is displayed on the screen or not. If not, we fetch users until is displayed to fill the page
   * @returns {void}
   */
  const hasScrollbar = useCallback((): void => {
    const pageHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    if (pageHeight === windowHeight) fetchNextPage();
  }, []);

  /**
   * This function notify to all that we are connected
   * @returns {void}
   */
  const setUserIsConnected = useCallback((): void => {
    if (!user._id) return;
    emitEvent(ISocketEvent.USER_IS_CONNECTED, user);
  }, []);

  /**
   * This function group all socket events
   * @param {unknown} event - Event type sended from server side
   * @returns {void}
   */
  const onEvent = (event: unknown): void => {
    const { type, data: dataEvent } = parseSocketEvent(event);
    switch (type) {
      case ISocketEvent.USER_IS_CONNECTED:
        onUserConnected(dataEvent as IUser);
        break;
      case ISocketEvent.USER_IS_DISCONNECTED:
        onUserDisconnected(dataEvent as IUser);
        break;
      case ISocketEvent.USER_UDPATE:
        updateUser(dataEvent as IUser, { isConnected: true });
        break;
      case ISocketEvent.USER_DELETE:
        onUserDelete(dataEvent as IUser);
        break;
      default:
        break;
    }
  };

  /**
   * This function is use to handle delete account of a user
   * @param {IUser} updatedUser - Event type sended from server side
   * @returns {void}
   */
  const onUserDelete = (updatedUser: IUser) => {
    queryClient.setQueriesData([QUERY_KEY.USERS, user._id], (oldData: IQueryUser | undefined) => {
      if (!oldData) return { pages: [], pageParams: [] };
      const userIdx = getUserIndexInQuery(updatedUser, oldData);
      if (userIdx === -1) return { ...oldData };
      const updatedPage = oldData.pages[userIdx].users.filter((u) => u._id !== updatedUser._id);
      oldData.pages[userIdx] = { users: updatedPage, total: oldData.pages[userIdx].total };
      return { ...oldData };
    });
  };

  /**
   * This function is use to handle any behavior about user connection receive from the socket and update users cache
   * @param {IUser} updatedUser - Event type sended from server side
   * @returns {void}
   */
  const onUserConnected = (updatedUser: IUser): void => {
    if (updatedUser._id === user._id) return;
    updateUser(updatedUser, { isConnected: true });
    if (!hasNextPage) {
      let updateAllQueries: boolean = false;
      if (searchTerm) updateAllQueries = !!updatedUser.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (updateAllQueries) {
        queryClient.setQueriesData([QUERY_KEY.USERS, user._id], (oldData: IQueryUser | undefined) =>
          handleNewUser(updatedUser, oldData)
        );
      } else {
        queryClient.setQueryData([QUERY_KEY.USERS, user._id, ""], (oldData: IQueryUser | undefined) =>
          handleNewUser(updatedUser, oldData)
        );
      }
    }
  };

  /**
   * This function is use to handle any behavior about user disconnection receive from the socket and update users cache
   * @param {IUser} updatedUser - Event type sended from server side
   * @returns {void}
   */
  const onUserDisconnected = (updatedUser: IUser): void => updateUser(updatedUser, { isConnected: false });

  /**
   * This function is use to handle any behavior about user update receive from the socket and update users cache
   * @param {IUser} updatedUser - Event type sended from server side
   * @param {boolean} isConnected - To know the current connection state of user
   * @returns {void}
   */
  const updateUser = (updatedUser: IUser, { isConnected }: { isConnected: boolean }): void => {
    queryClient.setQueriesData([QUERY_KEY.USERS, user._id], (oldData: IQueryUser | undefined) => {
      if (!oldData) return { pages: [], pageParams: [] };
      const userIdx = getUserIndexInQuery(updatedUser, oldData);
      if (userIdx === -1) return { ...oldData };

      const updatedPage = oldData.pages[userIdx].users.map((u) =>
        u._id === updatedUser._id
          ? { ...u, online: isConnected, name: updatedUser.name, email: updatedUser.email, pictureId: updatedUser.pictureId }
          : u
      );
      oldData.pages[userIdx] = { users: updatedPage, total: oldData.pages[userIdx].total };
      return { ...oldData };
    });
  };

  /**
   * This function is use to handle any behavior about user first connection receive from the socket and update users cache
   * @param {IUser} updatedUser - Event type sended from server side
   * @param {IQueryUser | undefined} oldData - Previous data from users cache
   * @returns {IQueryUser}
   */
  const handleNewUser = (updatedUser: IUser, oldData: IQueryUser | undefined): IQueryUser => {
    if (!oldData) return { pages: [], pageParams: [] };
    const userIdx = getUserIndexInQuery(updatedUser, oldData);
    if (userIdx >= 0) return { ...oldData };
    const lastPageIndex = oldData.pages.length - 1;
    const isFull = oldData.pages[lastPageIndex].users.length === FETCH_USERS_LIMIT;
    if (isFull) {
      oldData.pages.push({ users: [updatedUser], total: oldData.pages[lastPageIndex].total + 1 }); // Create new Array
    } else {
      oldData.pages[lastPageIndex].users.push(updatedUser); // Update last array
    }
    return { ...oldData };
  };

  return { users, isFetching, hasNextPage };
};

/**
 * This function is use to get index of user in the selected cache
 * @param {IUser} updatedUser - Event type sended from server side
 * @param {IQueryUser} oldData - Previous data from users cache
 * @returns {number}
 */
const getUserIndexInQuery = (updatedUser: IUser, oldData: IQueryUser): number => {
  const allUsersInQuery = oldData.pages.map((p) => p.users.map((u) => u)).flat() ?? [];
  const userIdx = allUsersInQuery.findIndex((u) => u._id === updatedUser._id);
  if (userIdx === -1) return -1;
  return getIndexFromNumber(userIdx);
};
