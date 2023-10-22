import { useMutation, useQuery, useQueryClient } from "react-query";
import { IUser } from "../../apis/IUser";
import { IQueryCacheData } from "../../types/Query/IQueryCacheData";
import { useCallback } from "react";
import { getAllUsers } from "../../apis/actions/UserAction";
import { QUERY_KEY } from "./queryKey";
import { queryOptions } from "./queryOption";

export const useQueryCache = () => {
  const queryClient = useQueryClient();

  const updateDataCache = useCallback(
    (data: unknown, queryKey: unknown[]) => queryClient.setQueryData(queryKey, data),
    []
  );

  const mutation = useMutation(async (data: IQueryCacheData) => updateDataCache(data.data, data.queryKey));

  // ================ useQuery ================ //
  const queryUsers = useQuery<IUser[]>(QUERY_KEY.USERS, getAllUsers, queryOptions);

  // ================ Data cache ================ //
  const usersCache = queryClient.getQueryData<IUser[]>(QUERY_KEY.USERS) ?? [];

  return { mutate: mutation.mutate, queryUsers, usersCache };
};
