import React, { useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Store/useContext";

const Login = () => {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.loginTitle}>Login to Manjoo Farm</h2>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className={styles.forgotPassword}>Forgot Password?</span>
          <button type="submit" className={styles.btnPrimary}>
            Login
          </button>
        </form>
        <p className={styles.loginFooter}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.toggleForm}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
