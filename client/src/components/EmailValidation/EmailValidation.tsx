import { FC } from "react";
import "./EmailValidation.css";
import { IFormValidation } from "../../types/Input/IFormValidation";
import CheckIcon from "../../icons/CheckIcon/CheckIcon";

const FormValidation: FC<IFormValidation> = (props) => {
  return (
    <span className="form-validation" data-testid="form-validation">
      <span data-form-validation={props.isValid.toString()}>{props.isValid && <CheckIcon />}</span>
    </span>
  );
};

export default FormValidation;
