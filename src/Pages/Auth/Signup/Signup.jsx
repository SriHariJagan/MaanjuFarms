import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Store/useContext";
import {
  Leaf, UserPlus, Mail, Lock, User, Eye, EyeOff, Loader2,
  Sprout, Sun, Wind, CheckCircle
} from "lucide-react";

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const Signup = () => {
  const { signup, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const res = await signup(name, email, password);
    setIsLoading(false);
    if (res.success) {
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.splitLayout}>
        <motion.div
          className={styles.brandSide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            className={styles.brandMedia}
            src="/Images/aboutUs/crops.jpg"
            alt="Maanjoo Farms"
          />
          <div className={styles.brandOverlay} />
          <div className={styles.brandContent}>
            <motion.img
              src="/Images/logo.png"
              alt="Maanjoo Farms"
              className={styles.brandLogo}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 0.95, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.h1
              className={styles.brandTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Maanjoo Farms
            </motion.h1>
            <motion.p
              className={styles.brandTagline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Join our community and embrace a life of natural wellness and organic living.
            </motion.p>
            <motion.div
              className={styles.brandDivider}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.div
              className={styles.brandFeatures}
              initial="initial"
              animate="animate"
              variants={stagger}
            >
              {[
                { icon: Sprout, text: "100% Organic & Naturally Grown" },
                { icon: Sun, text: "Sustainably Farmed, Sun-Kissed" },
                { icon: Wind, text: "Farm-to-Table Freshness" },
              ].map((item, i) => (
                <motion.div key={i} className={styles.brandFeature} variants={fadeUp}>
                  <div className={styles.featureIcon}>
                    <item.icon size={16} />
                  </div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div className={styles.formSide}>
          <motion.div
            className={styles.card}
            variants={scaleIn}
            initial="initial"
            animate="animate"
          >
            <div className={styles.cardInner}>
              <motion.div
                className={styles.cardHeader}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.logoWrapper}>
                  <Leaf size={24} />
                </div>
                <h1 className={styles.cardTitle}>Create Account</h1>
                <p className={styles.cardSubtitle}>Join Maanjoo Farms today</p>
              </motion.div>

              <motion.form
                className={styles.form}
                onSubmit={handleSignup}
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                <AnimatePresence>
                  {localError && (
                    <motion.div
                      className={styles.errorBanner}
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {localError}
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      className={styles.errorBanner}
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      className={styles.successBanner}
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <CheckCircle size={16} />
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div className={styles.inputGroup} variants={fadeUp}>
                  <input
                    type="text"
                    id="signup-name"
                    className={styles.floatingInput}
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                  <label htmlFor="signup-name" className={styles.floatingLabel}>
                    Full Name
                  </label>
                  <span className={styles.inputIcon}>
                    <User size={16} />
                  </span>
                </motion.div>

                <motion.div className={styles.inputGroup} variants={fadeUp}>
                  <input
                    type="email"
                    id="signup-email"
                    className={styles.floatingInput}
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <label htmlFor="signup-email" className={styles.floatingLabel}>
                    Email address
                  </label>
                  <span className={styles.inputIcon}>
                    <Mail size={16} />
                  </span>
                </motion.div>

                <motion.div className={styles.inputGroup} variants={fadeUp}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="signup-password"
                    className={styles.floatingInput}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <label htmlFor="signup-password" className={styles.floatingLabel}>
                    Password
                  </label>
                  <span className={styles.inputIcon}>
                    <Lock size={16} />
                  </span>
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </motion.div>

                <motion.div className={styles.inputGroup} variants={fadeUp}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    id="signup-confirm"
                    className={styles.floatingInput}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <label htmlFor="signup-confirm" className={styles.floatingLabel}>
                    Confirm Password
                  </label>
                  <span className={styles.inputIcon}>
                    <Lock size={16} />
                  </span>
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </motion.div>

                <motion.p className={styles.termsText} variants={fadeUp}>
                  By creating an account, you agree to our{" "}
                  <a href="/" className={styles.termsLink}>Terms of Service</a>{" "}
                  and{" "}
                  <a href="/" className={styles.termsLink}>Privacy Policy</a>.
                </motion.p>

                <motion.button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                  variants={fadeUp}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isLoading ? (
                    <Loader2 size={18} className={styles.spinner} />
                  ) : (
                    <UserPlus size={18} />
                  )}
                  <span>{isLoading ? "Creating account..." : "Create Account"}</span>
                </motion.button>
              </motion.form>

              <motion.div
                className={styles.footer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <span>Already have an account?</span>
                <Link to="/login" className={styles.footerLink}>
                  Sign in
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
