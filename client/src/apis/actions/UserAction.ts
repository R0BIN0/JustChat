import { IUser } from "IUser";
import axios from "axios";
import { tryCatch } from "../../utils/tryCatch";

const LOCAL_ROUTE = "http://localhost:8000/api/v1";

const loginAction = async (data: Pick<IUser, "email" | "password">): Promise<{ token: string }> => {
  const response = await axios.post(`${LOCAL_ROUTE}/login`, data);
  return response.data;
};

export const login = tryCatch(loginAction);
