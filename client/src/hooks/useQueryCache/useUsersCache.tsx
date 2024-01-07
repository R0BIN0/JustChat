import { useInfiniteQuery } from "react-query";
import { IUser } from "../../apis/IUser.ts";
import { QUERY_KEY } from "./queryKey.ts";
import { FETCH_USERS_LIMIT } from "../../const/const.ts";
import { queryOptions } from "./queryOptions.ts";
import { queryClient } from "../../main.tsx";
import { getUsers } from "../../apis/actions/UserAction.ts";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store.tsx";

export const useUsersCache = (searchTerm: string) => {
  const userId = useSelector((s: IRootState) => s.user._id);

  const queryUsers = useInfiniteQuery<{ users: IUser[]; total: number }>([QUERY_KEY.USERS, userId, searchTerm], getUsers, {
    ...queryOptions,
    staleTime: Infinity,
    getNextPageParam: (lastPage, allPages) => {
      const morePagesExist = allPages.length * FETCH_USERS_LIMIT < lastPage.total;
      if (!morePagesExist) return;
      return allPages.length * FETCH_USERS_LIMIT;
    },
  });

  // Remove all queries with searchTerm to avoid overloading cache
  const removeUnusedQueries = () => {
    const queries = queryClient.getQueriesData(QUERY_KEY.USERS);
    queries.forEach((q) => q[0][2] && queryClient.removeQueries([QUERY_KEY.USERS, userId, q[0][2]]));
  };

  return { queryUsers, removeUnusedQueries };
};
