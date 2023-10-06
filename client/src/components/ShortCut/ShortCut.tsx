import { FC } from "react";
import { IShortCut } from "../../types/Input/IShortCut";
import "./ShortCut.css";

const ShortCut: FC<IShortCut> = (props) => {
  const mainDivStyle = {
    background: props.colors.primaryBackground,
    border: `1px solid ${props.colors.color}`,
  };

  const secondDivStyle = {
    border: `1px solid ${props.colors.secondaryBackground}`,
  };

  const pStyle = {
    color: props.colors.color,
  };

  return (
    <div className="shortCut-keyboard-btn">
      <div style={mainDivStyle}></div>
      <div style={secondDivStyle}></div>
      <p style={pStyle}>{props.label}</p>
    </div>
  );
};

export default ShortCut;
