import axios from "axios";
import { tryCatch } from "../../utils/tryCatch";
import { IChat } from "../IChat";

const LOCAL_ROUTE = "http://localhost:8000/api/v1";

const getChatAction = async ({ queryKey }: { queryKey: string[] }): Promise<IChat> => {
  const response = await axios.get(`${LOCAL_ROUTE}/chat?userId=${queryKey[1]}&otherUserId=${queryKey[2]}`);
  return response.data.chat;
};

export const getChat = tryCatch(getChatAction);
