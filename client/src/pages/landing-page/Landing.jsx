import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="overlay">
        <header className="landing-header">
          <div className="logo">
            Gamers Den <FontAwesomeIcon icon={faGamepad} />
          </div>
          <div className="auth-buttons">
            <Link to="/login">
              <button className="btn login-btn">Login</button>
            </Link>
            <Link to="/signup">
              <button className="btn signup-btn">Sign Up</button>
            </Link>
          </div>
        </header>

        <main className="hero">
          <h1>Borrow. Lend. Play.</h1>
          <p>Discover and share amazing games with your local community.</p>
        </main>
      </div>
    </div>
  );
};

export default Landing;
