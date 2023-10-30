import MessageList from "../../components/MessageList/MessageList";
import InputMessage from "../../components/InputMessage/InputMessage";
import "./Chat.css";
import ChatTop from "../../components/ChatTop/ChatTop";
import { useChat } from "./Chat.logic";
import Home from "../Home/Home";

const Chat = () => {
  useChat();

  return (
    <div className="chat-container">
      <div className="chat-user-list">
        <Home onlyUserList={true} />
      </div>
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
