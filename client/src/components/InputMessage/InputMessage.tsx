import { useInputMessage } from "./InputMessage.logic";
import "./InputMessage.css";
import InputButton from "../InputButton/InputButton";
import { IInputButton } from "../../types/Input/IInputButton";

const InputMessage = () => {
  const logic = useInputMessage();
  return (
    <div className="input-message-container">
      <div className="input-message-content">
        <input
          className="input-message-inp"
          type="text"
          placeholder="Envoyer un message"
          {...logic.register("message")}
        />
        <div className="input-message-button-container">
          <InputButton icon={IInputButton.IMAGE} disabled={true} />
          <InputButton icon={IInputButton.EMOJI} disabled={false} />
        </div>
      </div>
      <button onClick={logic.handleSubmit(logic.onSubmit)} data-form-validity={true} className="input-message-submit">
        Envoyer
      </button>
    </div>
  );
};

export default InputMessage;
