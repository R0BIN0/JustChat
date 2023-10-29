import MessageList from "../../components/MessageList/MessageList";
import InputMessage from "../../components/InputMessage/InputMessage";
import "./Chat.css";
import ChatTop from "../../components/ChatTop/ChatTop";
import { useChat } from "./Chat.logic";

const Chat = () => {
  useChat();

  return (
    <div className="chat-container">
      <div className="chat-user-list"></div>
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
