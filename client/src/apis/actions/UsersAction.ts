import axios from "axios";
import { tryCatch } from "../../utils/tryCatch";
import { IUser } from "../IUser";
import { isAuthenticate } from "../config/isAuthenticate";
import { FETCH_USERS_LIMIT, LOCAL_ROUTE } from "../../const/const";

const getUsersAction = async ({
  pageParam = 0,
  queryKey,
}: {
  pageParam: number;
  queryKey: string[];
}): Promise<{ users: IUser[]; total: number }> => {
  const userId = queryKey[1];
  const searchTerm = queryKey[2];
  const response = await axios.get(
    `${LOCAL_ROUTE}/users/all?userId=${userId}&search=${searchTerm}&start=${pageParam}&limit=${FETCH_USERS_LIMIT}`,
    isAuthenticate()
  );
  return response.data;
};
export const getUsers = tryCatch(getUsersAction);
