import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

import "../App.css";
const Header = ({ token }) => {
  const navigate = useNavigate();
  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div className="header-component">
      <header className="banner">
        <nav>
          <button className="profile-btn">
            <Link to="/profile">Profile</Link>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
        <h1>
          Gamers Den <FontAwesomeIcon icon={faGamepad} />
        </h1>
      </header>
    </div>
  );
};
export default Header;
