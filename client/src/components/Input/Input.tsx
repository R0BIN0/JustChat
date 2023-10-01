import React, { FC } from "react";
import { IInput } from "../../types/Input/IInput";
import "./Input.css";

const Input: FC<IInput> = (props) => {
  const { originalValue, condition, otherValue } = props.type;
  return (
    <input
      className="form-input"
      type={!condition ? otherValue : originalValue}
      id={props.id}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      data-error={props.error}
    />
  );
};

export default Input;
