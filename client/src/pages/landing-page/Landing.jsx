import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Landing.css";

const images = [
  "/src/assets/images/Naruto.jpg",
  "/src/assets/images/GTAV.jpg",
  "/src/assets/images/MK.jpg",
  "/src/assets/images/RDR2.jpg",
  "/src/assets/images/Mario.jpg",
  "/src/assets/images/ELDSCR.jpg",
];

const Landing = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      <div className="slideshow">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            className={index === currentIndex ? "active" : ""}
            alt={`background-${index}`}
          />
        ))}
      </div>

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
