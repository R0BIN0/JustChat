import { memo } from "react";
import "./Scrollbar.css";
import { useScrollbar } from "./ScrollBar.logic";

const ScrollBar = memo(() => {
  const logic = useScrollbar();
  return (
    <div className="scrollbar-container">
      <div className="scrollbar">
        <div style={{ height: `${logic.scroll.percentage}%` }}></div>
      </div>
      <div className="scrollbar-click-event"></div>
    </div>
  );
});

export default ScrollBar;
