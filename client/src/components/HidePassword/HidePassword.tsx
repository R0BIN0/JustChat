import { FC } from "react";
import "./HidePassword.css";
import { IHidePassword } from "../../types/Input/IHidePassword";
import HidePasswordIcon from "../../icons/HidePasswordIcon/HidePasswordIcon";

const HidePassword: FC<IHidePassword> = (props) => {
  return (
    <button type="button" className="show-password" data-password-is-hidden={props.isHidden} onClick={props.onClick}>
      <HidePasswordIcon />
    </button>
  );
};

export default HidePassword;
