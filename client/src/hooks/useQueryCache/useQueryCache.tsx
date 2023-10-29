/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQueryClient } from "react-query";
import { IQueryCacheData } from "../../types/Query/IQueryCacheData";
import { useCallback } from "react";

export const useQueryCache = () => {
  const queryClient = useQueryClient();

  const updateDataCache = useCallback(
    (data: unknown, queryKey: unknown[]) => queryClient.setQueryData(queryKey, data),
    []
  );

  const mutation = useMutation(async (data: IQueryCacheData) => updateDataCache(data.data, data.queryKey));

  return { mutate: mutation.mutate };
};
