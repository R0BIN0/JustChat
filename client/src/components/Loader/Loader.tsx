import "./Loader.css";
import { memo } from "react";

const Loader = memo((props: { message?: string; fullSize?: boolean }) => {
  return (
    <div data-testid="loader-container" className="loader-container" data-full-size={!!props.fullSize}>
      <div className="loader"></div>
      {props.message && <p className="loader-message">{props.message}</p>}
    </div>
  );
});

export default Loader;
