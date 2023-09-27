/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "IUser";
import axios from "axios";
import { catchError } from "../../utils/catchError";

const LOCAL_ROUTE = "http://localhost:8000/api/v1";

export const login = async (
  data: Pick<IUser, "email" | "password">
): Promise<{ user: string }> => {
  try {
    const response = await axios.post(`${LOCAL_ROUTE}/login`, data);
    return response.data;
  } catch (err: any) {
    throw catchError(err);
  }
};
