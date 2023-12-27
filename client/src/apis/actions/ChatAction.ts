import axios from "axios";
import { tryCatch } from "../../utils/tryCatch";
import { IChat } from "../IChat";
import { IUserDTO } from "../IUserDTO";

const LOCAL_ROUTE = "http://localhost:8000/api/v1";

const getChatAction = async ({ queryKey }: { queryKey: string[] }): Promise<IChat> => {
  const response = await axios.get(`${LOCAL_ROUTE}/chat?userId=${queryKey[1]}&otherUserId=${queryKey[2]}`);
  return response.data.chat;
};

const getContactAction = async ({ queryKey }: { queryKey: string[] }): Promise<{ users: IUserDTO }> => {
  const contactId = queryKey[1];
  const res = await axios.post(`${LOCAL_ROUTE}/user`, { _id: contactId });
  return res.data;
};

export const getChat = tryCatch(getChatAction);
export const getContact = tryCatch(getContactAction);
