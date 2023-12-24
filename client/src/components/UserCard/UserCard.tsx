import { FC, memo } from "react";
import "./UserCard.css";
import { IUser } from "../../apis/IUser";
import { Link } from "react-router-dom";
import { shouldSubstring } from "../../utils/shouldSubstring";

const UserCard: FC<IUser> = memo((props) => {
  const { online } = props;

  return (
    <Link className="userCard-container" data-online={online} to={`/chat/${props._id}`}>
      <div className="userCard-left">
        <div className="userCard-left-picture-container">
          <img src={`/assets/avatar/avatar_${props.pictureId}.png`} alt="User Avatar" />
        </div>
        <div className="userCard-left-text-container">
          <div className="userCard-left-text-tooltip-container">
            <p>Name: {props.name}</p>
            <p>Email: {props.email}</p>
          </div>
          <p>{shouldSubstring(props.name, 17)}</p>
          <span>{shouldSubstring(props.email, 23)}</span>
        </div>
      </div>
      <div className="userCard-right" data-online={online}>
        {online ? <p>Connecté</p> : <p>Déconnecté</p>}
        <span className="userCard-right-status"></span>
      </div>
    </Link>
  );
});

export default UserCard;
