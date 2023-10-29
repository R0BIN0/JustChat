import { useInputMessage } from "./InputMessage.logic";
import "./InputMessage.css";

const InputMessage = () => {
  const logic = useInputMessage();
  return (
    <div className="input-message-container">
      <input
        className="input-message-inp"
        type="text"
        placeholder="Envoyer un message"
        {...logic.register("message")}
      />
      <button onClick={logic.handleSubmit(logic.onSubmit)} data-form-validity={true} className="input-message-submit">
        Envoyer
      </button>
    </div>
  );
};

export default InputMessage;
