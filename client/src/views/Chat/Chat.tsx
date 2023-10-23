/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryCache } from "../../hooks/useQueryCache/useQueryCache";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { ISocketEvent } from "../../apis/ISocketEvent";
import { IMessage } from "../../apis/IMessage";
import { parseSocketEvent } from "../../utils/parseSocketEvent";
import { QUERY_KEY } from "../../hooks/useQueryCache/queryKey";

const Chat = () => {
  // Services
  const params = useParams();

  const { chatCache, mutate } = useQueryCache();
  const { webSocket, emitEvent } = useSelector((s: IRootState) => s.socket);
  const user = useSelector((s: IRootState) => s.user);

  const [state, setState] = useState<string>("");

  const onSubmit = () => {
    const message = {
      conversationId: chatCache._id,
      content: state,
      date: new Date(),
      receiver: params.id,
      sender: user._id,
    };
    const newCache = { ...chatCache, messages: [...chatCache.messages, message] };
    mutate({ data: newCache, queryKey: [QUERY_KEY.CHAT, user._id, params.id] });
    emitEvent(ISocketEvent.SEND_MESSAGE, message);
  };

  useEffect(() => {
    if (!webSocket) return;
    webSocket.addEventListener("message", onEvent);
    return () => {
      webSocket.removeEventListener("message", onEvent);
    };
  }, [webSocket, chatCache]);

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
    const newCache = { ...chatCache, messages: [...chatCache.messages, message] };
    mutate({ data: newCache, queryKey: [QUERY_KEY.CHAT, user._id, params.id] });
    emitEvent(ISocketEvent.SEND_MESSAGE, message);
  };

  return (
    <div>
      <h1>Messages :</h1>
      <div>
        {chatCache.messages &&
          chatCache.messages.map((item, i) => (
            <p style={{ color: "white" }} key={i}>
              {item.content}
            </p>
          ))}
      </div>
      <input type="text" onChange={(e) => setState(e.target.value)} />
      <button style={{ background: "white" }} onClick={() => onSubmit()}>
        aaa
      </button>
    </div>
  );
};

export default Chat;
