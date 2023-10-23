/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery, useQueryClient } from "react-query";
import { IUser } from "../../apis/IUser";
import { IQueryCacheData } from "../../types/Query/IQueryCacheData";
import { useCallback } from "react";
import { getAllUsers } from "../../apis/actions/UserAction";
import { QUERY_KEY } from "./queryKey";
import { queryOptions } from "./queryOption";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { getChat } from "../../apis/actions/ChatAction";
import { IChat } from "../../apis/IChat";

export const useQueryCache = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const userId = useSelector((s: IRootState) => s.user._id);

  const updateDataCache = useCallback(
    (data: unknown, queryKey: unknown[]) => queryClient.setQueryData(queryKey, data),
    []
  );

  const mutation = useMutation(async (data: IQueryCacheData) => updateDataCache(data.data, data.queryKey));

  // ================ useQuery ================ //
  const queryUsers = useQuery<IUser[]>(QUERY_KEY.USERS, getAllUsers, { ...queryOptions, staleTime: Infinity });

  const queryChat = useQuery<IChat>([QUERY_KEY.CHAT, userId, params.id], getChat, {
    ...queryOptions,
    enabled: !!(userId && params.id),
  });

  // ================ Data cache ================ //
  const usersCache = queryClient.getQueryData<IUser[]>(QUERY_KEY.USERS) ?? [];
  const chatCache = queryClient.getQueriesData<IChat>([QUERY_KEY.CHAT, userId, params.id])[0][1] ?? {};

  return { mutate: mutation.mutate, queryUsers, usersCache, queryChat, chatCache };
};
