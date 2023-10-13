import { FC } from "react";
import UserCard from "../UserCard/UserCard";
import { useUserList } from "./UserList.logic";
import { IUserList } from "../../types/Users/IUserList";

const UserList: FC<IUserList> = (props) => {
  const logic = useUserList(props);
  if (logic.isLoading || logic.error) return <></>;

  return (
    <div className="home-users-container">
      {logic.data?.map((item) => (
        <UserCard key={item._id} {...item} hidden={logic.isHide(item.name)} />
      ))}
    </div>
  );
};

export default UserList;
