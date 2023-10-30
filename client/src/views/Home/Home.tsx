import "./Home.css";
import UserList from "../../components/UserList/UserList";
import InputSearch from "../../components/InputSearch/InputSearch";
import { useHome } from "./Home.logic";

const Home = (props: { onlyUserList: boolean }) => {
  const logic = useHome();
  return (
    <div className="home-container">
      <div className="home-content" data-only-user-list={props.onlyUserList}>
        {!props.onlyUserList && (
          <div className="home-title-container">
            <h1>Discuter avec tout le monde !</h1>
          </div>
        )}
        {!logic.state.isLoaded ? (
          displayLoading()
        ) : logic.state.hasError ? (
          displayError(logic.state.hasError.message)
        ) : (
          <div className="home-filter-container">
            <InputSearch handleInput={logic.handleSearchInput} />
            {/* <div className="home-filter-btn-container">
                    <button>Filtres</button>
                  </div> */}
          </div>
        )}
        <UserList
          onRef={(ref) => (logic.homeRef.current = ref)}
          toggleIsLoaded={logic.toggleIsLoaded}
          handleError={logic.handleError}
        />
      </div>
    </div>
  );
};

const displayLoading = () => (
  <div className="home-data-container">
    <div className="home-data-loader"></div>
    <p className="home-data-loader-subtitle">Chargement des utilisateurs</p>
  </div>
);

const displayError = (errMessage: string) => (
  <div className="home-data-container">
    <p className="home-data-error-subtitle">{errMessage}</p>
  </div>
);

export default Home;
