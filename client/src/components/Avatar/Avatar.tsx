import "./Avatar.css";
import { useAvatar } from "./Avatar.logic";
import { AVATAR_LENGTH } from "../../const/const";
import Chevron from "../../icons/Chevron/Chevron";
import { memo } from "react";

const Avatar = memo((props: { handleAvatar: (idx: number) => void }) => {
  const logic = useAvatar(props);

  return (
    <div className="avatar-container">
      <button onClick={logic.handleGoBack}>
        <Chevron />
      </button>
      <div className="avatar-carousel-container">
        <div
          className="avatar-carousel-img-container"
          style={{ transform: `translateX(calc(-66px * ${logic.currentIdx}))` }}
        >
          {Array.from({ length: AVATAR_LENGTH }).map((_, i) => (
            <img
              key={i}
              className={logic.currentIdx + 1 === i ? "current-selected-avatar" : ""}
              src={`/assets/avatar/avatar_${i + 1}.png`}
              alt="User Avatar"
            />
          ))}
        </div>
      </div>
      <button onClick={logic.handleGoNext}>
        <Chevron />
      </button>
    </div>
  );
});

export default Avatar;
