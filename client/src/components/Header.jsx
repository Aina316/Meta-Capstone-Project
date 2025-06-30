import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../services/authentication";
import "../App.css";

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };
  const handleHomePage = () => {
    navigate("/home");
  };

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
        <h1 onClick={handleHomePage}>
          Gamers Den <FontAwesomeIcon icon={faGamepad} />
        </h1>
      </header>
    </div>
  );
};

export default Header;
