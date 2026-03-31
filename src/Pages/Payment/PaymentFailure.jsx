import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./PaymentStatus.module.css";
import { XCircle } from "lucide-react";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const error =
    params.get("error") || "Something went wrong with your payment.";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <XCircle className={styles.errorIcon} />

        <h1>Payment Failed ❌</h1>

        <p className={styles.errorMsg}>{error}</p>

        <p className={styles.redirectText}>
          Redirecting in 5 seconds...
        </p>

        <div className={styles.actions}>
          <button
            onClick={() => navigate(-1)}
            className={styles.secondaryBtn}
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className={styles.primaryBtn}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;