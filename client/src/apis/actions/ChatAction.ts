import axios from "axios";
import { tryCatch } from "../../utils/tryCatch";
import { IChat } from "../IChat";
import { isAuthenticate } from "../config/isAuthenticate";
import { LOCAL_ROUTE } from "../../const/const";

const getChatAction = async ({ queryKey }: { queryKey: string[] }): Promise<IChat> => {
  const response = await axios.get(`${LOCAL_ROUTE}/chat?userId=${queryKey[1]}&otherUserId=${queryKey[2]}`, isAuthenticate());
  return response.data.chat;
};

export const getChat = tryCatch(getChatAction);
