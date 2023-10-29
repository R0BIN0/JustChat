import { useEffect, useRef } from "react";
import { useQueryCache } from "../../hooks/useQueryCache/useQueryCache";
import { useDispatch, useSelector } from "react-redux";
import { IAppDispatch, IRootState } from "../../redux/store";
import { parseSocketEvent } from "../../utils/parseSocketEvent";
import { ISocketEvent } from "../../apis/ISocketEvent";
import { IMessage } from "../../apis/IMessage";
import { useParams } from "react-router-dom";
import { QUERY_KEY } from "../../hooks/useQueryCache/queryKey";
import { IUserDTO } from "../../apis/IUserDTO";
import { useChatCache } from "../../hooks/useQueryCache/useChatCache";
import { setChatContainerRef } from "../../redux/reducers/chatReducer";

export const useMessageList = () => {
  // Services
  const params = useParams();
  const { mutate } = useQueryCache();
  const { webSocket } = useSelector((s: IRootState) => s.socket);
  const user = useSelector((s: IRootState) => s.user);
  const { contact, scroll } = useSelector((s: IRootState) => s.chat);
  const { queryChat } = useChatCache(contact._id);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const dispatchCtx = useDispatch<IAppDispatch>();

  useEffect(() => {
    dispatchCtx(setChatContainerRef(chatContainerRef.current));
  }, []);

  useEffect(() => {
    if (!webSocket) return;
    webSocket.addEventListener("message", onEvent);
    return () => {
      webSocket.removeEventListener("message", onEvent);
    };
  }, [webSocket, queryChat.data]);

  const onEvent = (event: unknown) => {
    const { type, data: dataEvent } = parseSocketEvent(event);
    switch (type) {
      case ISocketEvent.SEND_MESSAGE:
        onReceiveMessage(dataEvent as Omit<IMessage, "conversationId">);
        break;
      default:
        break;
    }
  };

  const onReceiveMessage = (message: Omit<IMessage, "conversationId">) => {
    if (message.sender !== params.id) return;
    const newCache = { ...queryChat.data, messages: [...queryChat.data.messages, message] };
    mutate({ data: newCache, queryKey: [QUERY_KEY.CHAT, user._id, params.id] });
    scroll.scrollToBottom();
  };

  const isSameSender = (currentIdx: number): boolean => {
    const { messages } = queryChat.data;
    const prevMessageIdx = currentIdx - 1;
    if (prevMessageIdx < 0) return false;
    return messages[currentIdx].sender === messages[prevMessageIdx].sender;
  };

  const getInfos = (item: IMessage): Pick<IUserDTO, "name" | "pictureId"> => {
    const isMe = item.sender === user._id;
    if (isMe) {
      return { name: user.name, pictureId: user.pictureId };
    } else {
      return { name: contact.name, pictureId: contact.pictureId };
    }
  };

  return {
    chat: queryChat.data,
    isLoading: queryChat.isLoading,
    isSameSender,
    contact,
    getInfos,
    chatContainerRef,
  };
};
