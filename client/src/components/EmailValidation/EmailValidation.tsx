import { FC } from "react";
import { IEmailValidation } from "../../types/Input/IEmailValidation";
import Check from "../../assets/svg/check.svg?react";
import "./EmailValidation.css";

const EmailValidation: FC<IEmailValidation> = (props) => {
  return (
    <span className="email-validation">
      <span data-email-validation={props.isValid}>{props.isValid && <Check />}</span>
    </span>
  );
};

export default EmailValidation;
