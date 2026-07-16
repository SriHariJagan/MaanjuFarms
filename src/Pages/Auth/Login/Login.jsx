import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Store/useContext";
import {
  Leaf, LogIn, Mail, Lock, Eye, EyeOff, Loader2,
  Sprout, Sun, Wind
} from "lucide-react";

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.07,
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

const Login = () => {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (res.success) {
      if (res.isAdmin) navigate("/admin");
      else navigate("/");
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
            src="/Images/aboutUs/farm.jpg"
            alt="Maanjoo Farms landscape"
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
              Organic Farming, Fresh Produce & Farm Stay — rooted in nature, grown with care.
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
                <h1 className={styles.cardTitle}>Welcome Back</h1>
                <p className={styles.cardSubtitle}>Sign in to your account</p>
              </motion.div>

              <motion.form
                className={styles.form}
                onSubmit={handleLogin}
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                <AnimatePresence>
                  {error && (
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
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div className={styles.inputGroup} variants={fadeUp}>
                  <input
                    type="email"
                    id="login-email"
                    className={styles.floatingInput}
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <label htmlFor="login-email" className={styles.floatingLabel}>
                    Email address
                  </label>
                  <span className={styles.inputIcon}>
                    <Mail size={16} />
                  </span>
                </motion.div>

                <motion.div className={styles.inputGroup} variants={fadeUp}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    className={styles.floatingInput}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <label htmlFor="login-password" className={styles.floatingLabel}>
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

                <motion.div className={styles.formOptions} variants={fadeUp}>
                  <label className={styles.rememberMe}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className={styles.forgotLink}>
                    Forgot password?
                  </Link>
                </motion.div>

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
                    <LogIn size={18} />
                  )}
                  <span>{isLoading ? "Signing in..." : "Sign In"}</span>
                </motion.button>
              </motion.form>

              <motion.div
                className={styles.footer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span>Don't have an account?</span>
                <Link to="/signup" className={styles.footerLink}>
                  Create account
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
