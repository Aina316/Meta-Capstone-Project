import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faBell } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../services/authentication";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { getUserProfile } from "../services/profileService";
import { fetchNotificationsForUser } from "../services/notificationService";
import defaultProfile from "/src/assets/images/default_avatar.jpg";
import "../App.css";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadCount = async () => {
      if (!user) return;
      const { data } = await fetchNotificationsForUser(user.id);
      if (data) {
        setUnreadCount(data.filter((n) => !n.read).length);
      }
    };
    loadCount();
  }, [user]);

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
          <Link to="/notifications" className="notifications-link">
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </Link>
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
