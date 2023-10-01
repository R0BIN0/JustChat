import { FC } from "react";
import "./HidePassword.css";
import { IHidePassword } from "../../types/Input/IHidePassword";
import HidePasswordSvg from "../../assets/svg/hide.svg?react";

const HidePassword: FC<IHidePassword> = (props) => {
  return (
    <button type="button" className="show-password" data-password-is-hidden={props.isHidden} onClick={props.onClick}>
      <HidePasswordSvg />
    </button>
  );
};

export default HidePassword;
