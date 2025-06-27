import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signIn } from "../../services/authentication";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    const { error: loginError } = await signIn(email, password);

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/home");
  };

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
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="password-login">
            <p>Password</p>
            <div className="password-input-box">
              <input
                type={visible ? "text" : "password"}
                name="password"
                pattern="[0-9a-fA-F]{4,8}"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                className="show-password"
                icon={visible ? faEye : faEyeSlash}
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>

          <button className="login-btn" onClick={handleLogin}>
            {loading ? "Logging in..." : "Log In"}{" "}
          </button>
          <p>
            Don't have a Gamers Den Account? <Link to="/signup">Signup</Link>
          </p>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default Login;
