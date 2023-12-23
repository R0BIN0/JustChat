import { FC } from "react";
import UserCard from "../UserCard/UserCard";
import { useUserList } from "./UserList.logic";
import { IUserList } from "../../types/Users/IUserList";
import "./UserList.css";
import Loader from "../Loader/Loader";

const UserList: FC<IUserList> = (props) => {
  const logic = useUserList(props);
  return (
    <div className="userList-container">
      {logic.users.length ? (
        <>
          {logic.users.map((item) => (
            <UserCard key={item._id} {...item} />
          ))}
        </>
      ) : (
        <>
          {!logic.isFetching && (
            <div className="userList-no-user-container">
              <p>Aucun utilisateur n'a été trouvé.</p>
            </div>
          )}
        </>
      )}

      {(logic.hasNextPage || logic.isFetching) && (
        <div style={{ width: "100%", padding: "2rem", position: "relative" }}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default UserList;
