import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { setCredentials } from "../store/authSlice";

import "./Login.css";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      dispatch(
        setCredentials({
          token,
          user,
        }),
      );

      navigate("/");
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-jm">JM</span>
            <span className="auth-logo-name">NOVA</span>
          </Link>

          <p className="auth-tagline">Modern shopping, made simple.</p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Welcome Back</h1>
            <p>Login to continue shopping with JMNOVA.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <span>Don't have an account?</span>{" "}
            <Link to="/register">Create an account</Link>
          </div>
        </div>

        <Link to="/" className="auth-back-link">
          ← Back to JMNOVA
        </Link>
      </div>
    </main>
  );
};

export default Login;
