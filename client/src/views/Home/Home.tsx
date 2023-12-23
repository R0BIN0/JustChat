import "./Home.css";
import UserList from "../../components/UserList/UserList";
import InputSearch from "../../components/InputSearch/InputSearch";
import { useHome } from "./Home.logic";
import { memo } from "react";

const Home = memo(() => {
  const logic = useHome();
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-title-container">
          <h1>Discuter avec tout le monde !</h1>
        </div>
        <div className="home-filter-container">
          <InputSearch handleInput={logic.handleSearchInput} />
        </div>
        <UserList onRef={(ref) => (logic.homeRef.current = ref)} />
      </div>
    </div>
  );
});

export default Home;
