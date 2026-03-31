import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Store/useContext";

const Signup = () => {
  const { signup, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const res = await signup(name, email, password);
    if (res.success) {
      alert("Signup successful! You can now login.");
      navigate("/login");
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <h2 className={styles.signupTitle}>Sign Up for Manjoo Farm</h2>
        <form className={styles.signupForm} onSubmit={handleSignup}>
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.btnPrimary}>
            Sign Up
          </button>
        </form>
        <p className={styles.signupFooter}>
          Already have an account?{" "}
          <Link to="/login" className={styles.toggleLogin}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
