import { useDropdown } from "./Dropdown.logic";
import "./Dropdown.css";

const Dropdown = () => {
  const logic = useDropdown();
  return (
    <div className="dropdown-container" ref={logic.dropDownContainer}>
      <button className="dropdown-button" onClick={logic.toggleIsActive}>
        <img src={`/assets/avatar/avatar_${logic.user.pictureId}.png`} alt="User Avatar" />
      </button>
      <div className="dropdown-dropdown">
        <div className="dropdown-dropdown-items-container" data-show={logic.isActive}>
          <button className="dropdown-dropdown-item" onClick={logic.openEditDialog}>
            <p>Modifier</p>
          </button>
          <button className="dropdown-dropdown-item dropdown-dropdown-item-delete" onClick={logic.handleDisconnect}>
            <p>Déconnexion</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
