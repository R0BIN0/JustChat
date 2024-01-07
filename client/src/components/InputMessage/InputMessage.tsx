import { useInputMessage } from "./InputMessage.logic";
import "./InputMessage.css";
import EmojiButton from "../InputButton/EmojiButton";
import SendIcon from "../../icons/SendIcon/SendIcon";

const InputMessage = () => {
  const logic = useInputMessage();

  return (
    <div className="input-message-container">
      <div className="input-message-content">
        <input
          className="input-message-inp"
          type="text"
          placeholder="Envoyer un message"
          value={logic.message}
          onChange={logic.handleInput}
        />
        <div className="input-message-button-container">
          <EmojiButton setEmoji={logic.setEmoji} />
        </div>
      </div>
      <button
        onClick={logic.handleSubmit}
        data-form-validity={true}
        className="input-message-submit input-message-submit-desktop"
      >
        Envoyer
      </button>
      <button
        onClick={logic.handleSubmit}
        data-form-validity={true}
        className="input-message-submit input-message-submit-mobile"
      >
        <SendIcon />
      </button>
    </div>
  );
};

export default InputMessage;
