import React, { useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

import styles from "./PaymentStatus.module.css";

import { XCircle } from "lucide-react";

import { PAYMENT_ENDPOINTS } from "../../urls";

const PaymentFailure = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const params = new URLSearchParams(location.search);

  // ================= GET PARAMS =================

  const rawError = params.get("error");

  const razorpay_order_id = params.get("order_id");

  const error = rawError
    ? decodeURIComponent(rawError)
    : "We couldn’t process your payment. Please try again.";

  // ================= UPDATE FAILED STATUS =================

  useEffect(() => {
    const markFailed = async () => {
      try {
        if (!razorpay_order_id) return;

        const token = localStorage.getItem("token");

        await axios.post(
          PAYMENT_ENDPOINTS.PAYMENT_FAILED,
          {
            razorpay_order_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("❌ Payment marked failed");
      } catch (err) {
        console.log(err);
      }
    };


    
    markFailed();
  }, [razorpay_order_id]);

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
