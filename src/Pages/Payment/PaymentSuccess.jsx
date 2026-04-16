import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./PaymentStatus.module.css";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const type = new URLSearchParams(location.search).get("type") || "product";

  const redirectPath = type === "booking" ? "/my-bookings" : "/orders";

  useEffect(() => {
    if (!type) return;

    const timer = setTimeout(() => {
      navigate(redirectPath, { replace: true });
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate, redirectPath]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <CheckCircle className={styles.successIcon} />

        <h1>Payment Successful 🎉</h1>

        <p>
          {type === "booking"
            ? "Your villa booking has been confirmed successfully."
            : "Your order has been placed successfully."}
        </p>

        <p className={styles.redirectText}>Redirecting automatically...</p>

        <button
          onClick={() => navigate(redirectPath)}
          className={styles.primaryBtn}
        >
          Go Now
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
