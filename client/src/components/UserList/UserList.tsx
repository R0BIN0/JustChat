import { FC } from "react";
import UserCard from "../UserCard/UserCard";
import { useUserList } from "./UserList.logic";
import { IUserList } from "../../types/Users/IUserList";
import "./UserList.css";

const UserList: FC<IUserList> = (props) => {
  const logic = useUserList(props);
  if (logic.isLoading || logic.error) return <></>;

  return (
    <div className="userList-container">
      {logic.users
        ?.filter((item) => item._id !== logic.user._id)
        .map((item) => (
          <UserCard key={item._id} {...item} hidden={logic.isHide(item.name)} />
        ))}
    </div>
  );
};

export default UserList;
