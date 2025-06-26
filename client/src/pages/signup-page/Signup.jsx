import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "/src/services/supabaseClient";
import { signUp, signIn } from "../../services/authentication";
import "./Signup.css";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !username) {
      alert("Please fill in all fields");
      return;
    }
    const { data: signupData, error: signupError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

    if (signupError) {
      alert(signupError.message);
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
        alert(profileError.message);
        return;
      }
    }

    alert("Signup successful! Check your email to confirm your account.");
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
              id="username-signup-box"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="email-signup">
            <p>Email</p>
            <input
              type="text"
              name="email"
              id="email-signup"
              required
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="password-signup">
            <p>Password</p>
            <input
              type="password"
              name="password"
              id="password-signup-box"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="signup-btn" onClick={handleSignup}>
            Create an Account
          </button>
          <p>
            Already Have an Account? <Link to="/login">Login</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
