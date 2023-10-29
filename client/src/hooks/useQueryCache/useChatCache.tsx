import { useSelector } from "react-redux";
import { getChat } from "../../apis/actions/ChatAction";
import { IRootState } from "../../redux/store";
import { queryOptions } from "./queryOptions";
import { useQuery } from "react-query";
import { IChat } from "../../apis/IChat";
import { QUERY_KEY } from "./queryKey";

export const useChatCache = (contactId: string) => {
  const userId = useSelector((s: IRootState) => s.user._id);

  const queryChat = useQuery<IChat>([QUERY_KEY.CHAT, userId, contactId], getChat, {
    ...queryOptions,
    enabled: !!(userId && contactId),
  });

  return { queryChat: { ...queryChat, data: queryChat.data || ({} as IChat) } };
};
