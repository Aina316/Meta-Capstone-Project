import "./Login.css";
const Login = () => {
  return (
    <main className="login-component">
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
        <input
          type="password"
          name="password"
          id="password-login-box"
          placeholder="Password"
          required
        />
      </div>

      <button className="login-btn">Login</button>
      <p>
        Don't have a Gamers Den Account? <a href="#signup-page"> Sign Up</a>
      </p>
    </main>
  );
};

export default Login;
