import { useState, memo, useRef, FC } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import "./Home.css";
import ShortCut from "../../components/ShortCut/ShortCut";
import UserCard from "../../components/UserCard/UserCard";
import { IConnectedUser } from "../../types/IConnectedUser";
import SearchIconSvg from "../../assets/svg/search.svg?react";
import { useHome } from "./Home.logic";
import { IInputSearch } from "../../types/Input/IInputSearch";

const Home = () => {
  const logic = useHome();
  console.log(logic.state.search);
  const [users] = useState<IConnectedUser[]>([
    {
      pictureId: 1,
      name: "Robin",
      email: "bernard@gmail.com",
      online: true,
    },

    {
      pictureId: 1,
      name: "Bernard",
      email: "bernard@gmail.com",
      online: false,
    },
    {
      pictureId: 1,
      name: "Robin",
      email: "bernard@gmail.com",
      online: true,
    },
    {
      pictureId: 1,
      name: "Bernard",
      email: "bernard@gmail.com",
      online: false,
    },
    {
      pictureId: 1,
      name: "Bernard",
      email: "bernard@gmail.com",
      online: false,
    },
  ]);

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-title-container">
          <h1>Discuter avec tout le monde !</h1>
        </div>
        <div className="home-filter-container">
          <InputSearch handleInput={logic.handleSearchInput} />
          {/* <div className="home-search-inp-container">
            <input type="text" placeholder="Rechercher par nom d’utilisateur" />
            <button className="home-search-btn" onClick={() => setX((x) => x + 1)}>
              <SearchIconSvg />
            </button>
            <ShortCut
              label="S"
              colors={{ primaryBackground: "#242530", color: "#565873", secondaryBackground: "#303342" }}
            />
          </div> */}
          <div className="home-filter-btn-container">
            <button>Filtres</button>
          </div>
        </div>
        <div className="home-users-container">
          {users.map((item, i) => (
            <UserCard key={i} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const InputSearch: FC<IInputSearch> = memo((props) => {
  console.log("RENDER INPUT SEARCH");
  return (
    <div className="home-search-inp-container">
      <input type="text" placeholder="Rechercher par nom d’utilisateur" onChange={props.handleInput} />
      <button className="home-search-btn">
        <SearchIconSvg />
      </button>
      <ShortCut label="S" colors={{ primaryBackground: "#242530", color: "#565873", secondaryBackground: "#303342" }} />
    </div>
  );
});

export default Home;
