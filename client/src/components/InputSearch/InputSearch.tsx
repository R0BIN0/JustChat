import { FC, memo } from "react";
import { useSearchInput } from "./InputSearch.logic";
import ShortCut from "../ShortCut/ShortCut";
import SearchIconSvg from "../../assets/svg/search.svg?react";
import { IInputSearch } from "../../types/Input/IInputSearch";

const InputSearch: FC<IInputSearch> = memo((props) => {
  const logic = useSearchInput();
  return (
    <div className="home-search-inp-container">
      <input ref={logic.ref} type="text" placeholder="Rechercher par nom d’utilisateur" onChange={props.handleInput} />
      <button className="home-search-btn">
        <SearchIconSvg />
      </button>
      <ShortCut label="S" colors={{ primaryBackground: "#242530", color: "#494B62", secondaryBackground: "#303342" }} />
    </div>
  );
});

export default InputSearch;
