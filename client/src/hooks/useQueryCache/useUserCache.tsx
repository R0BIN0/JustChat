import { useQuery } from "react-query";
import { IUser } from "../../apis/IUser";
import { getAllUsers } from "../../apis/actions/UserAction";
import { QUERY_KEY } from "./queryKey";
import { queryOptions } from "./queryOptions";

export const useUserCache = () => {
  const queryUsers = useQuery<IUser[]>(QUERY_KEY.USERS, getAllUsers, { ...queryOptions, staleTime: Infinity });
  return { queryUsers: { ...queryUsers, data: queryUsers.data || [] } };
};
