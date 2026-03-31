import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./PaymentStatus.module.css";
import { CheckCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { PAYMENT_ENDPOINTS } from "../../urls";
import { useVillas } from "../../Store/useContext"; // 👈 IMPORTANT

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { fetchBookings } = useVillas(); // 👈 get context function

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = new URLSearchParams(location.search).get("session_id");

        if (!sessionId) {
          return navigate("/payment-failed?error=Invalid session");
        }

        const res = await axios.get(
          `${PAYMENT_ENDPOINTS.VERIFY}?session_id=${sessionId}`
        );

        if (!res.data.success) {
          return navigate("/payment-failed?error=Payment not verified");
        }

        setType(res.data.type);

        // 🔥 WAIT for webhook to complete
        setTimeout(async () => {
          try {
            await fetchBookings(); // ✅ REFRESH DATA
          } catch (e) {
            console.log("Fetch booking error:", e);
          }

          // ✅ Redirect to correct page
          if (res.data.type === "booking") {
            navigate("/my-bookings");
          } else {
            navigate("/orders");
          }

        }, 3000); // ⏳ wait for webhook

      } catch (err) {
        console.error("Verification error:", err);
        navigate("/payment-failed?error=Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location, navigate, fetchBookings]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <Loader2 className={styles.loader} />
          <h2>Verifying your payment...</h2>
        </div>
      </div>
    );
  }

  // ================= SUCCESS =================
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <CheckCircle className={styles.successIcon} />

        <h1>Payment Successful 🎉</h1>

        <p>
          {type === "booking"
            ? "Your villa booking is confirmed!"
            : "Your order has been placed successfully!"}
        </p>

        <p className={styles.redirectText}>
          Redirecting...
        </p>

        <button
          onClick={() =>
            navigate(type === "booking" ? "/my-bookings" : "/orders")
          }
          className={styles.primaryBtn}
        >
          Go Now
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;