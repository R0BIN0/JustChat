import { IUser } from "IUser";
import axios from "axios";

const LOCAL_ROUTE = "http://localhost:8000/api/v1";

export const login = async (
    data: Pick<IUser, "email" | "password">
): Promise<{ user: string }> => {
    const response = await axios.post(`${LOCAL_ROUTE}/login`, data);
    console.log(response);
    return response.data;
};
