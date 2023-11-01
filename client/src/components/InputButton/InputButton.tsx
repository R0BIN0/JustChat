import { IInputButton } from "../../types/Input/IInputButton";
import ImageIcon from "../../assets/svg/Image.svg?react";
import EmojiIcon from "../../assets/svg/Emoji.svg?react";
import "./InputButton.css";

const InputButton = (props: { icon: IInputButton; disabled: boolean }) => {
  const IconRender = (icon: IInputButton) => {
    const map = {
      [IInputButton.IMAGE]: <ImageIcon />,
      [IInputButton.EMOJI]: <EmojiIcon />,
    };
    return map[icon];
  };

  return (
    <div className="input-button-container" data-disabled={props.disabled}>
      <button>{IconRender(props.icon)}</button>
    </div>
  );
};

export default InputButton;
