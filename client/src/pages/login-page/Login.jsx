import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { signIn } from "../../services/authentication";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setVisible((v) => !v);
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

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      navigate("/home");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("bio, location")
      .eq("id", userId)
      .single();

    setLoading(false);

    if (profileError || !profile) {
      navigate("/home");
    } else if (!profile.bio || !profile.location) {
      navigate("/newuser");
    } else {
      navigate("/home");
    }
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
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="password-login">
            <p>Password</p>
            <div className="password-input-box">
              <input
                type={visible ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={visible ? faEyeSlash : faEye}
                onClick={togglePasswordVisibility}
                className="show-password"
              />
            </div>
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p>
            Don’t have a Gamers Den account? <Link to="/signup">Sign up</Link>
          </p>

          {error && <p className="error-text">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default Login;
