import { FC, memo } from "react";
import { useSearchInput } from "./InputSearch.logic";
import ShortCut from "../ShortCut/ShortCut";
import { IInputSearch } from "../../types/Input/IInputSearch";

const InputSearch: FC<IInputSearch> = memo((props) => {
  const logic = useSearchInput();
  return (
    <div className="home-search-inp-container">
      <input ref={logic.ref} type="text" placeholder="Rechercher par nom d’utilisateur" onChange={props.handleInput} />
      <ShortCut label="S" colors={{ primaryBackground: "#1b1c24", color: "#494B62", secondaryBackground: "#303342" }} />
    </div>
  );
});

export default InputSearch;
