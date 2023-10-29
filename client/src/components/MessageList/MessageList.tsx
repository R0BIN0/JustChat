import Message from "../Message/Message";
import { useMessageList } from "./MessageList.logic";
import "./MessageList.css";
import ScrollBar from "../Scrollbar/ScrollBar";

const MessageList = () => {
  const logic = useMessageList();
  // if (logic.isLoading) return <></>;

  return (
    <div ref={logic.chatContainerRef} className="messageList-container">
      <ScrollBar />
      {logic.chat.messages &&
        logic.chat.messages.map((item, i) => {
          const isSameSender = logic.isSameSender(i);
          const infoToDisplay = logic.getInfos(item);
          return <Message key={i} {...item} isSameSender={isSameSender} infoToDisplay={infoToDisplay} />;
        })}
    </div>
  );
};

export default MessageList;
