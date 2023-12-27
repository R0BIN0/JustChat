import "./ChatTop.css";
import { useChatTop } from "./ChatTop.logic";

const ChatTop = () => {
  const logic = useChatTop();

  if (!logic.contact) return <></>;

  return (
    <div className="chatTop-container">
      <div className="chatTop-user-card">
        <div className="chatTop-user-card-left">
          <img src={`/assets/avatar/avatar_${logic.contact.pictureId}.png`} alt="User Avatar" />
          <p>{logic.contact.name}</p>
          <div className="chatTop-online-container" data-online={logic.contact.online}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatTop;
