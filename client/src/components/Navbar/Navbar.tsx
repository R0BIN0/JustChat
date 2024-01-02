import { useNavbar } from "./Navbar.logic";
import "./Navbar.css";
import LogoIcon from "../../icons/LogoIcon/LogoIcon";
import { Link } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";

const Navbar = () => {
  const logic = useNavbar();
  return (
    <div className="nav-container">
      <div className="nav-left">
        <Link to="/home">
          <LogoIcon />
        </Link>
      </div>
      <div className="nav-right">
        {logic.auth.isAuthenticated ? (
          <Dropdown />
        ) : (
          <ul>
            <li>
              <Link to="/">Se connecter</Link>
            </li>
            <li>
              <Link to="/register">S'enregistrer</Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
