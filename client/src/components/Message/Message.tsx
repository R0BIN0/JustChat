import { IMessage } from "../../apis/IMessage";
import { memo } from "react";
import "./Message.css";
import { IUserDTO } from "../../apis/IUserDTO";
import { formatDate } from "../../utils/formatDate";

const Message = memo(
  (props: IMessage & { isSameSender: boolean; infoToDisplay: Pick<IUserDTO, "name" | "pictureId"> }) => {
    return (
      <div className="message-container" data-is-same-sender={props.isSameSender}>
        {!props.isSameSender && (
          <div className="message-left-container">
            <img src={`/assets/avatar/avatar_${props.infoToDisplay.pictureId}.png`} alt="User Avatar" />
          </div>
        )}
        <div className="message-right-container">
          {!props.isSameSender && (
            <div className="message-name-container">
              <p>{props.infoToDisplay.name}</p>
              <span>{formatDate(props.date)}</span>
            </div>
          )}

          <p className="message-content">{props.content}</p>
        </div>
      </div>
    );
  }
);

export default Message;
