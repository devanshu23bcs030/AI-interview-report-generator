import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useauth";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const { user , loading, handlelogin } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  if (user){
    navigate("/") ;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await handlelogin(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  };
  if (loading) {
    return <main>Loading .....</main>;
  }
  return (
    <main>
      <div className="form-container">
        <h1>This is the Login Page</h1>
        {error ? (
          <p className="auth-error" role="alert">
            {error}
          </p>
        ) : null}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              name="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="button primary-button" type="submit">
            Login
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
