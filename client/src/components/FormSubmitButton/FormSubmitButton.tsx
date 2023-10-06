import { FC } from "react";
import { IFormSubmitButton } from "../../types/Form/IFormSubmitButton";
import "./FormSubmitButton.css";
import ShortCut from "../ShortCut/ShortCut";

const FormSubmitButton: FC<IFormSubmitButton> = (props) => {
  return (
    <button id="submit" type="submit" data-form-validity={props.formIsValid} className="form-submit-btn">
      {props.isLoading ? (
        <div data-testid="form-submit-loader" className="form-submit-loader"></div>
      ) : (
        <>
          <p>{props.label}</p>
          {props.keyboardSubmit.isAvailable && (
            <ShortCut
              label="Enter"
              colors={{ primaryBackground: "#d1cb32", color: "#18191e", secondaryBackground: "#4f5164" }}
            />
          )}
        </>
      )}
    </button>
  );
};

export default FormSubmitButton;
