import axios from "axios";
import { tryCatch } from "../../utils/tryCatch";
import { IUser } from "../IUser";
import { IUserDTO } from "../IUserDTO";
import { FETCH_USERS_LIMIT } from "../../const/const";

const LOCAL_ROUTE = "http://localhost:8000/api/v1";

const registerAction = async (
  data: IUser & { confirmPassword: string }
): Promise<{ token: string; user: IUserDTO }> => {
  const response = await axios.post(`${LOCAL_ROUTE}/register`, data);
  return response.data;
};

const loginAction = async (data: Pick<IUser, "email" | "password">): Promise<{ token: string; user: IUserDTO }> => {
  const response = await axios.post(`${LOCAL_ROUTE}/login`, data);
  return response.data;
};

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
    `${LOCAL_ROUTE}/users/all?userId=${userId}&search=${searchTerm}&start=${pageParam}&limit=${FETCH_USERS_LIMIT}`
  );
  return response.data;
};

export const login = tryCatch(loginAction);
export const register = tryCatch(registerAction);
export const getUsers = tryCatch(getUsersAction);
