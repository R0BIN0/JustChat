import { FC, memo } from "react";
import "./UserCard.css";
import { IConnectedUser } from "../../types/IConnectedUser";

const UserCard: FC<IConnectedUser> = memo((props) => {
  const { online } = props;

  return (
    <div className="userCard-container" data-online={online}>
      <div className="userCard-left">
        <div className="userCard-left-picture-container">
          <img src={`/assets/avatar/avatar_${props.pictureId}.png`} alt="User Avatar" />
        </div>
        <div className="userCard-left-text-container">
          <p>{props.name}</p>
          <span>{props.email}</span>
        </div>
      </div>
      <div className="userCard-right" data-online={online}>
        {online ? <p>Connecté</p> : <p>Déconnecté</p>}
        <span className="userCard-right-status"></span>
      </div>
    </div>
  );
});

export default UserCard;
