import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "/src/services/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Signup.css";
import PopupMessage from "../../components/PopupMessage";
import { signUp } from "../../services/authentication";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [visible, setVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  const handleSignup = async () => {
    if (!email || !password || !username) {
      setPopupMessage("Please fill in all fields");
      return;
    }

    const { data: signupData, error: signupError } = await signUp(
      email,
      password
    );

    if (signupError) {
      return;
    }

    const userId = signupData.user?.id;

    if (userId) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: userId,
          username,
        },
      ]);

      if (profileError) {
        return;
      }
    }

    setPopupMessage(
      "Signup successful! Check your email to confirm your account."
    );
    navigate("/login");
  };

  return (
    <div className="signup">
      <main className="signup-component">
        <div className="signup-component-content">
          <h2>Join The Community!</h2>
          <div className="username-signup">
            <p>Username</p>
            <input
              type="text"
              name="username"
              required
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="email-signup">
            <p>Email</p>
            <input
              type="text"
              name="email"
              required
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="password-signup">
            <p>Password</p>
            <div className="password-input-box">
              <input
                type={visible ? "text" : "password"}
                name="password"
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
          <button className="signup-btn" onClick={handleSignup}>
            Create an Account
          </button>
          <p>
            Already Have an Account? <Link to="/login">Login</Link>
          </p>
        </div>
      </main>
      {popupMessage && (
        <PopupMessage
          message={popupMessage}
          onClose={() => setPopupMessage("")}
        />
      )}
    </div>
  );
};

export default Signup;
