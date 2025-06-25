import { Link } from "react-router-dom";

import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  return (
    <div className="login">
      <main className="login-component">
        <div className="login-component-content">
          <h2>Login to Gamers Den!</h2>
          <div className="email-login">
            <p>Email</p>
            <input
              type="text"
              name="email"
              id="email-login"
              required
              placeholder="Email"
            />
          </div>
          <div className="password-login">
            <p>Password</p>
            <div className="password-input-box">
              <input
                type="password"
                name="password"
                pattern="[0-9a-fA-F]{4,8}"
                placeholder="Password"
                required
              />
              <FontAwesomeIcon className="show-password" icon={faEye} />
            </div>
          </div>

          <button className="login-btn">Login</button>
          <p>
            Don't have a Gamers Den Account? <Link to="/signup">Signup</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
