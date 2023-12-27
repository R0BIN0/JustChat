import "./Chat.css";
import ChatTop from "../../components/ChatTop/ChatTop";
import InputMessage from "../../components/InputMessage/InputMessage";
import MessageList from "../../components/MessageList/MessageList";
import { useChat } from "./Chat.logic";
import Loader from "../../components/Loader/Loader";

const Chat = () => {
  const logic = useChat();

  if (logic.isLoading) return <Loader fullSize />;

  return (
    <div className="chat-container">
      <div className="chat-content">
        <div className="chat-top-container">
          <ChatTop />
        </div>
        <div className="chat-content-container">
          <MessageList />
          <InputMessage />
        </div>
      </div>
    </div>
  );
};

export default Chat;
