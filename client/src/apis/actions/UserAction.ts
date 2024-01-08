import axios from "axios";
import { tryCatch } from "../../utils/tryCatch";
import { IUser } from "../IUser";
import { IUserDTO } from "../IUserDTO";
import { LOCAL_ROUTE, SESSION_STORAGE_TOKEN } from "../../const/const";
import { isAuthenticate } from "../config/isAuthenticate";

const registerAction = async (data: IUser & { confirmPassword: string }): Promise<{ token: string; user: IUserDTO }> => {
  const res = await axios.post(`${LOCAL_ROUTE}/register`, data);
  sessionStorage.setItem(SESSION_STORAGE_TOKEN, res.data.token);
  return res.data;
};

const loginAction = async (data: Pick<IUser, "email" | "password">): Promise<{ token: string; user: IUserDTO }> => {
  const res = await axios.post(`${LOCAL_ROUTE}/login`, data, isAuthenticate());
  sessionStorage.setItem(SESSION_STORAGE_TOKEN, res.data.token);
  return res.data;
};

const getUserAction = async ({ queryKey }: { queryKey: string[] }): Promise<{ users: IUserDTO }> => {
  const contactId = queryKey[1];
  const res = await axios.post(`${LOCAL_ROUTE}/user`, { _id: contactId }, isAuthenticate());
  return res.data;
};

const updateUserAction = async (data: Pick<IUser, "_id" | "name" | "email" | "pictureId">): Promise<void> =>
  await axios.put(`${LOCAL_ROUTE}/user/update`, data, isAuthenticate());

const deleteUserAction = async (data: Pick<IUser, "_id">): Promise<void> =>
  await axios.put(`${LOCAL_ROUTE}/user/delete`, data, isAuthenticate());

export const register = tryCatch(registerAction);
export const login = tryCatch(loginAction);
export const getUser = tryCatch(getUserAction);
export const updateUser = tryCatch(updateUserAction);
export const deleteUser = tryCatch(deleteUserAction);
