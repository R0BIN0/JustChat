import { useSelector } from "react-redux";
import "./ChatTop.css";
import { IRootState } from "../../redux/store";

const ChatTop = () => {
  const { contact } = useSelector((s: IRootState) => s.chat);

  return (
    <div className="chatTop-container">
      <div className="chatTop-user-card">
        <img src={`/assets/avatar/avatar_${contact.pictureId}.png`} alt="User Avatar" />
        <p>{contact.name}</p>
        <div data-online={contact.online}></div>
      </div>
    </div>
  );
};

export default ChatTop;
