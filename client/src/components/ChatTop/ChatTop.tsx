import "./ChatTop.css";
import { useChatTop } from "./ChatTop.logic";
import UsersIcon from "../../assets/svg/UsersIcon.svg?react";
import CrossIcon from "../../assets/svg/CrossIcon.svg?react";

const ChatTop = () => {
  const logic = useChatTop();

  return (
    <>
      <div className="chatTop-container">
        <div className="chatTop-user-card">
          <div className="chatTop-user-card-left">
            <img src={`/assets/avatar/avatar_${logic.contact.pictureId}.png`} alt="User Avatar" />
            <p>{logic.contact.name}</p>
            <div className="chatTop-online-container" data-online={logic.contact.online}></div>
          </div>
          <div className="chatTop-user-card-right">
            <button onClick={logic.openModal}>
              <UsersIcon />
            </button>
          </div>
        </div>
      </div>
      {logic.state.usersDialogIsOpen && (
        <div className="chatTop-home-modal-container">
          <div className="chatTop-home-modal-banner">
            <button onClick={logic.closeModal}>
              <CrossIcon />
            </button>
          </div>
          {/* <Home onlyUserList={true} /> */}
        </div>
      )}
    </>
  );
};

export default ChatTop;
