import axios from "axios";
import { tryCatch } from "../../utils/tryCatch";
import { IChat } from "../IChat";
import { IUserDTO } from "../IUserDTO";
import { isAuthenticate } from "../config/isAuthenticate";

const LOCAL_ROUTE = "http://localhost:8000/api/v1";

const getChatAction = async ({ queryKey }: { queryKey: string[] }): Promise<IChat> => {
  const response = await axios.get(
    `${LOCAL_ROUTE}/chat?userId=${queryKey[1]}&otherUserId=${queryKey[2]}`,
    isAuthenticate()
  );
  return response.data.chat;
};

const getContactAction = async ({ queryKey }: { queryKey: string[] }): Promise<{ users: IUserDTO }> => {
  const contactId = queryKey[1];
  const res = await axios.post(`${LOCAL_ROUTE}/user`, { _id: contactId }, isAuthenticate());
  return res.data;
};

export const getChat = tryCatch(getChatAction);
export const getContact = tryCatch(getContactAction);
