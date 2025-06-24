import "./Signup.css";
const Signup = () => {
  return (
    <main className="signup-component">
      <h2>Join The Guild!</h2>
      <div className="username-signup">
        <p>Username</p>
        <input
          type="text"
          name="username"
          required
          id="username-signup-box"
          placeholder="Username"
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
        />
      </div>

      <button className="signup-btn">Create an Account</button>
      <p>
        Already Have an Account? <a href="#login-page"> Login</a>
      </p>
    </main>
  );
};

export default Signup;
