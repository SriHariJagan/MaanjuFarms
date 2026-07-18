import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ResetPassword.module.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AUTH_API } from "../../../urls";
import {
  Lock, ArrowLeft, Loader2, KeyRound,
  Sprout, Sun, Wind, CheckCircle, Eye, EyeOff
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

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(`${AUTH_API}/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
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
          <video
            className={styles.brandMedia}
            src="/videos/video1.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/Images/aboutUs/farm.jpg"
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
                <div className={styles.iconCircle}>
                  <KeyRound size={28} />
                </div>
                <h1 className={styles.cardTitle}>Reset Password</h1>
                <p className={styles.cardSubtitle}>
                  Enter your new password below.
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.successBanner}>
                      <CheckCircle size={32} style={{ display: 'block', margin: '0 auto 12px' }} />
                      <strong>Password reset successful!</strong>
                      <br />
                      You can now log in with your new password.
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                      <Link to="/login" className={styles.footerLink}>
                        Go to Login
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    className={styles.form}
                    onSubmit={handleSubmit}
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                    exit={{ opacity: 0, y: -10 }}
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
                        type={showPassword ? "text" : "password"}
                        id="reset-password"
                        className={styles.floatingInput}
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        minLength={6}
                      />
                      <label htmlFor="reset-password" className={styles.floatingLabel}>
                        New password
                      </label>
                      <span className={styles.inputIcon}>
                        <Lock size={16} />
                      </span>
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </motion.div>

                    <motion.div className={styles.inputGroup} variants={fadeUp}>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="reset-confirm-password"
                        className={styles.floatingInput}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        minLength={6}
                      />
                      <label htmlFor="reset-confirm-password" className={styles.floatingLabel}>
                        Confirm new password
                      </label>
                      <span className={styles.inputIcon}>
                        <Lock size={16} />
                      </span>
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
                        <KeyRound size={18} />
                      )}
                      <span>{isLoading ? "Resetting..." : "Reset Password"}</span>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

              {!success && (
                <motion.div
                  className={styles.footer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <ArrowLeft size={14} />
                  <Link to="/login" className={styles.footerLink}>
                    Back to login
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
