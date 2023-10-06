import axios from "axios";
import { tryCatch } from "../../utils/tryCatch";
import { IUser } from "../IUser";

const LOCAL_ROUTE = "http://localhost:8000/api/v1";

const registerAction = async (
  data: IUser & { confirmPassword: string }
): Promise<{ token: string; user: Omit<IUser, "password"> }> => {
  const response = await axios.post(`${LOCAL_ROUTE}/register`, data);
  return response.data;
};

const loginAction = async (data: Pick<IUser, "email" | "password">): Promise<{ token: string }> => {
  const response = await axios.post(`${LOCAL_ROUTE}/login`, data);
  return response.data;
};

const getAllUsersAction = async (): Promise<{ users: IUser[] }> => {
  const response = await axios.get(`${LOCAL_ROUTE}/users/all`);
  return response.data;
};

export const login = tryCatch(loginAction);
export const register = tryCatch(registerAction);
export const getAllUsers = tryCatch(getAllUsersAction);
