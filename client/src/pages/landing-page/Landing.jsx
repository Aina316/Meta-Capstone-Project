import { Link } from "react-router-dom";

import "./Landing.css";
const Landing = () => {
  return (
    <div className="landing-page-component">
      <div className="landingpage-header-component">
        <header>
          <div className="login-signup-btns">
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/signup">
              <button>Signup</button>
            </Link>
          </div>
        </header>
      </div>
      <main>
        <p>This is the Landing Page</p>
      </main>
    </div>
  );
};
export default Landing;
