import { memo, FC } from "react";
import "./FormHeader.css";
import { IFormHeader } from "../../types/Form/IFormHeader";

const FormHeader: FC<IFormHeader> = memo((props) => {
  return (
    <div data-testid="formHeader-container" className="formHeader-title-container">
      <h1>{props.title}</h1>
      <h2>{props.subtitle}</h2>
    </div>
  );
});

export default FormHeader;
