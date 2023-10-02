import React, { FC } from "react";
import { IInputError } from "../../types/Input/IInputError";
import "./InputError.css";

const InputError: FC<IInputError> = (props) => {
  if (!props.show || !props.error) return <></>;
  return <p className="input-error">{props.error.message}</p>;
};

export default InputError;
