import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./PaymentStatus.module.css";
import { XCircle } from "lucide-react";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const rawError = params.get("error");

  const error = rawError
    ? decodeURIComponent(rawError)
    : "We couldn’t process your payment. Please try again.";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <XCircle className={styles.errorIcon} />

        <h1>Payment Failed</h1>

        <p className={styles.errorMsg}>{error}</p>

        <p className={styles.helperText}>
          Don’t worry — no amount has been deducted.
        </p>

        <div className={styles.actions}>
          <button onClick={() => navigate(-1)} className={styles.secondaryBtn}>
            🔄 Retry Payment
          </button>

          <button onClick={() => navigate("/")} className={styles.primaryBtn}>
            🏠 Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
