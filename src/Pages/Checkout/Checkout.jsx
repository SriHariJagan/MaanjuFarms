import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./Checkout.module.css";
import { useCart } from "../../Store/useContext";
import axios from "axios";
import { PINCODE_ENDPOINTS } from "../../urls";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { formatPriceWithUnit } from "../../utils/getImageUrl ";

const Checkout = () => {
  const { cart, total, handleCheckout } = useCart();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    apartment: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [deliveryStatus, setDeliveryStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const latestRequest = useRef(0);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.trim().length < 3) error = "Minimum 3 characters required";
        break;
      case "phone":
        if (!value) error = "Phone number is required";
        else if (!/^[6-9]\d{9}$/.test(value)) error = "Enter valid 10-digit number";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
        break;
      case "street":
        if (!value.trim()) error = "Street address is required";
        else if (value.trim().length < 5) error = "Enter full address";
        break;
      case "city":
        if (!value.trim()) error = "City is required";
        break;
      case "pincode":
        if (!value) error = "Pincode is required";
        else if (!/^\d{6}$/.test(value)) error = "Pincode must be 6 digits";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const isFormValid = () => {
    return (
      Object.values(errors).every((err) => !err) &&
      address.name &&
      address.phone &&
      address.email &&
      address.street &&
      address.city &&
      address.state &&
      address.pincode &&
      deliveryStatus === "success"
    );
  };

  useEffect(() => {
    const pin = address.pincode;

    if (pin.length !== 6) {
      setDeliveryStatus("idle");
      setErrorMsg("");
      setAddress((prev) => ({ ...prev, district: "", state: "" }));
      return;
    }

    const fetchLocation = async () => {
      const requestId = ++latestRequest.current;
      try {
        setDeliveryStatus("checking");
        const res = await axios.get(PINCODE_ENDPOINTS.CHECK(pin));
        if (requestId !== latestRequest.current) return;
        const response = res.data;
        if (!response.success) {
          setDeliveryStatus("error");
          setErrorMsg(response.message || "Delivery not available");
          setAddress((prev) => ({ ...prev, district: "", state: "" }));
          return;
        }
        setAddress((prev) => ({
          ...prev,
          district: response.data.district || "",
          state: response.data.state || "",
        }));
        setDeliveryStatus("success");
        setErrorMsg("");
      } catch (err) {
        console.log(err);
        setDeliveryStatus("error");
        setErrorMsg("Unable to verify pincode");
      }
    };

    const timer = setTimeout(fetchLocation, 500);
    return () => clearTimeout(timer);
  }, [address.pincode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    if (name === "pincode") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 6) return;
      setDeliveryStatus("idle");
      setErrorMsg("");
    }

    setAddress((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = () => {
    Object.keys(address).forEach((key) => {
      validateField(key, address[key]);
    });
    if (!isFormValid()) return;
    handleCheckout(address);
  };

  return (
    <div className={styles.checkout}>
      <div className={styles.container}>
        <motion.div
          className={styles.formSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.formHeader}>
            <h2>Delivery Details</h2>
            <span className={styles.stepBadge}>Step 1 of 2</span>
          </div>

          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                name="name"
                value={address.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=" "
              />
              <label>Full Name</label>
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <input
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder=" "
                />
                <label>Mobile Number</label>
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
              </div>
              <div className={styles.inputGroup}>
                <input
                  name="email"
                  value={address.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder=" "
                />
                <label>Email</label>
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <input
                name="street"
                value={address.street}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=" "
              />
              <label>Street Address</label>
              {errors.street && <span className={styles.error}>{errors.street}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input
                name="apartment"
                value={address.apartment}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Apartment / Suite (Optional)</label>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder=" "
                />
                <label>City</label>
                {errors.city && <span className={styles.error}>{errors.city}</span>}
              </div>
              <div className={styles.inputGroup}>
                <input value={address.district} readOnly placeholder=" " />
                <label>District</label>
              </div>
              <div className={styles.inputGroup}>
                <input value={address.state} readOnly placeholder=" " />
                <label>State</label>
              </div>
              <div className={styles.inputGroup}>
                <input
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder=" "
                />
                <label>Pincode</label>
                {errors.pincode && <span className={styles.error}>{errors.pincode}</span>}
              </div>
            </div>

            {deliveryStatus === "checking" && (
              <div className={styles.statusMsg}>
                <span className={styles.spinner} />
                Checking delivery availability...
              </div>
            )}

            {deliveryStatus === "error" && (
              <div className={styles.errorBox}>
                {errorMsg}
              </div>
            )}

            {deliveryStatus === "success" && (
              <div className={styles.successBox}>
                <strong>Delivery Available</strong>
                <p>{address.district}, {address.state}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`${styles.submitBtn} ${!isFormValid() ? styles.disabled : ""}`}
            >
              Continue to Payment
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>

        <motion.div
          className={styles.summary}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className={styles.summaryHeader}>
            <ShieldCheck size={20} className={styles.shieldIcon} />
            <h3>Order Summary</h3>
          </div>

          {cart.map((item) => (
            <div key={item.product._id} className={styles.summaryItem}>
              <span className={styles.summaryName}>{item.product.name}</span>
              <span className={styles.summaryQty}>x{item.quantity}</span>
              <span className={styles.summaryPrice}>{formatPriceWithUnit(item.product.price, item.product.unit)}</span>
            </div>
          ))}

          <div className={styles.summaryDivider} />
          <div className={styles.total}>
            <span>Total</span>
            <span>₹{total()}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
