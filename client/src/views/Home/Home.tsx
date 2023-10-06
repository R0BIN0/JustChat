import { useState, memo, useRef, FC } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import "./Home.css";
import ShortCut from "../../components/ShortCut/ShortCut";
import UserCard from "../../components/UserCard/UserCard";
import SearchIconSvg from "../../assets/svg/search.svg?react";
import { useHome } from "./Home.logic";
import { IInputSearch } from "../../types/Input/IInputSearch";

const Home = () => {
  const logic = useHome();

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-title-container">
          <h1>Discuter avec tout le monde !</h1>
        </div>
        <div className="home-filter-container">
          <InputSearch handleInput={logic.handleSearchInput} />
          <div className="home-filter-btn-container">
            <button>Filtres</button>
          </div>
        </div>
        <div className="home-users-container">
          {logic.state.users.isLoading ? (
            <p>CHARGEMENT</p>
          ) : logic.state.users.error ? (
            <p>Une erreur est survenue</p>
          ) : (
            <>{logic.state.users.data && logic.state.users.data.map((item, i) => <UserCard key={i} {...item} />)}</>
          )}
        </div>
      </div>
    </div>
  );
};

const InputSearch: FC<IInputSearch> = memo((props) => {
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
