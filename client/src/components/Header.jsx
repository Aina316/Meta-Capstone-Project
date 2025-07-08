import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../services/authentication";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { getUserProfile } from "../services/profileService";
import defaultProfile from "/src/assets/images/default_avatar.jpg";
import "../App.css";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const loadProfile = () => {
    getUserProfile()
      .then((data) => {
        setProfile(data);
      })
      .catch(() => {
        alert("Error fetching profile");
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

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
          {user && (
            <Link to="/profile">
              <img
                src={profile?.image || defaultProfile}
                alt="Profile"
                className="profile-btn"
              />
            </Link>
          )}
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
