import { useSelector } from "react-redux";
import { getChat } from "../../apis/actions/ChatAction";
import { IRootState } from "../../redux/store";
import { queryOptions } from "./queryOptions";
import { useQuery } from "react-query";
import { IChat } from "../../apis/IChat";
import { QUERY_KEY } from "./queryKey";
import { useParams } from "react-router-dom";

export const useChatCache = () => {
  const userId = useSelector((s: IRootState) => s.user._id);
  const params = useParams();

  const queryChat = useQuery<IChat>([QUERY_KEY.CHAT, userId, params.id], getChat, {
    ...queryOptions,
    staleTime: Infinity,
    enabled: !!(userId && params.id),
  });

  return { queryChat: { ...queryChat, data: queryChat.data || ({} as IChat) } };
};
