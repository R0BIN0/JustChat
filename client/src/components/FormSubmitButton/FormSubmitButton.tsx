import { FC } from "react";
import { IFormSubmitButton } from "../../types/Form/IFormSubmitButton";
import "./FormSubmitButton.css";

const FormSubmitButton: FC<IFormSubmitButton> = (props) => {
  return (
    <button id="submit" type="submit" data-form-validity={props.formIsValid} className="form-submit-btn">
      {props.isLoading ? (
        <div data-testid="form-submit-loader" className="form-submit-loader"></div>
      ) : (
        <>
          <p>{props.label}</p>
          {props.keyboardSubmit.isAvailable && (
            <div className="form-press-keyboard-btn">
              <div></div>
              <div></div>
              <p>{props.keyboardSubmit.key}</p>
            </div>
          )}
        </>
      )}
    </button>
  );
};

export default FormSubmitButton;
