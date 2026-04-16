import axios from "axios";
import { toast } from "react-toastify";

export const useRazorpayPayment = (token) => {
  const startPayment = async ({
    orderData,
    verifyUrl,
    onSuccess,
    onFailure,
    meta = {},
  }) => {
    try {
      if (!window.Razorpay) {
        throw new Error("Payment gateway failed to load");
      }

      if (!orderData?.orderId) {
        throw new Error("Invalid payment order");
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        order_id: orderData.orderId,

        name: "Manjoo Farms",
        description: meta.description || "Payment",

        prefill: meta.prefill || {},

        theme: {
          color: "#16a34a",
        },

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              verifyUrl,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (verifyRes.data?.success) {
              onSuccess?.(verifyRes.data);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            onFailure?.("Verification failed. Contact support.");
          }
        },

        modal: {
          ondismiss: function () {
            onFailure?.("Payment cancelled by user");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        onFailure?.(
          response.error?.description || "Payment failed. Try again."
        );
      });

      rzp.open();

    } catch (err) {
      console.error("Razorpay Init Error:", err);
      toast.error(err.message || "Payment initialization failed");
      onFailure?.(err.message);
    }
  };

  return { startPayment };
};