import React, { useState, useEffect, useRef } from "react";
import styles from "./Checkout.module.css";
import { useCart } from "../../Store/useContext";
import axios from "axios";

import { PINCODE_ENDPOINTS } from "../../urls";

/* ================= COMPONENT ================= */

const Checkout = () => {
  const { cart, total, handleCheckout } = useCart();

  /* ================= ADDRESS ================= */

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

  /* ================= STATES ================= */

  const [errors, setErrors] = useState({});

  const [deliveryStatus, setDeliveryStatus] =
    useState("idle");

  const [errorMsg, setErrorMsg] = useState("");

  const latestRequest = useRef(0);

  /* ================= VALIDATION ================= */

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 3) {
          error =
            "Minimum 3 characters required";
        }
        break;

      case "phone":
        if (!value) {
          error = "Phone number is required";
        } else if (
          !/^[6-9]\d{9}$/.test(value)
        ) {
          error =
            "Enter valid 10-digit number";
        }
        break;

      case "email":
        if (!value) {
          error = "Email is required";
        } else if (
          !/^\S+@\S+\.\S+$/.test(value)
        ) {
          error = "Invalid email format";
        }
        break;

      case "street":
        if (!value.trim()) {
          error =
            "Street address is required";
        } else if (
          value.trim().length < 5
        ) {
          error = "Enter full address";
        }
        break;

      case "city":
        if (!value.trim()) {
          error = "City is required";
        }
        break;

      case "pincode":
        if (!value) {
          error = "Pincode is required";
        } else if (
          !/^\d{6}$/.test(value)
        ) {
          error =
            "Pincode must be 6 digits";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  /* ================= HANDLE BLUR ================= */

  const handleBlur = (e) => {
    const { name, value } = e.target;

    validateField(name, value);
  };

  /* ================= FORM VALID ================= */

  const isFormValid = () => {
    return (
      Object.values(errors).every(
        (err) => !err
      ) &&
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

  /* ================= PINCODE CHECK ================= */

  useEffect(() => {
    const pin = address.pincode;

    /* ================= RESET ================= */

    if (pin.length !== 6) {
      setDeliveryStatus("idle");

      setErrorMsg("");

      setAddress((prev) => ({
        ...prev,
        district: "",
        state: "",
      }));

      return;
    }

    /* ================= FETCH ================= */

    const fetchLocation = async () => {
      const requestId =
        ++latestRequest.current;

      try {
        setDeliveryStatus("checking");

        const res = await axios.get(
          PINCODE_ENDPOINTS.CHECK(pin)
        );

        if (
          requestId !==
          latestRequest.current
        ) {
          return;
        }

        const response = res.data;

        /* ================= ERROR ================= */

        if (!response.success) {
          setDeliveryStatus("error");

          setErrorMsg(
            response.message ||
              "Delivery not available"
          );

          setAddress((prev) => ({
            ...prev,
            district: "",
            state: "",
          }));

          return;
        }

        /* ================= SUCCESS ================= */

        setAddress((prev) => ({
          ...prev,

          district:
            response.data.district || "",

          state:
            response.data.state || "",
        }));

        setDeliveryStatus("success");

        setErrorMsg("");
      } catch (err) {
        console.log(err);

        setDeliveryStatus("error");

        setErrorMsg(
          "Unable to verify pincode"
        );
      }
    };

    const timer = setTimeout(
      fetchLocation,
      500
    );

    return () => clearTimeout(timer);
  }, [address.pincode]);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    /* ================= PHONE ================= */

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;

      if (value.length > 10) return;
    }

    /* ================= PINCODE ================= */

    if (name === "pincode") {
      if (!/^\d*$/.test(value)) return;

      if (value.length > 6) return;

      setDeliveryStatus("idle");

      setErrorMsg("");
    }

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    Object.keys(address).forEach(
      (key) => {
        validateField(
          key,
          address[key]
        );
      }
    );

    if (!isFormValid()) return;

    handleCheckout(address);
  };

  /* ================= UI ================= */

  return (
    <section className={styles.checkout}>
      <div className={styles.container}>

        {/* ================= LEFT ================= */}

        <div className={styles.formSection}>
          <h2>Delivery Details</h2>

          <div className={styles.form}>

            {/* ================= NAME ================= */}

            <div className={styles.inputGroup}>
              <input
                name="name"
                value={address.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=""
              />

              <label>Full Name</label>

              {errors.name && (
                <span className={styles.error}>
                  {errors.name}
                </span>
              )}
            </div>

            {/* ================= PHONE + EMAIL ================= */}

            <div className={styles.row}>

              <div className={styles.inputGroup}>
                <input
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder=""
                />

                <label>
                  Mobile Number
                </label>

                {errors.phone && (
                  <span
                    className={styles.error}
                  >
                    {errors.phone}
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  name="email"
                  value={address.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder=""
                />

                <label>Email</label>

                {errors.email && (
                  <span
                    className={styles.error}
                  >
                    {errors.email}
                  </span>
                )}
              </div>

            </div>

            {/* ================= STREET ================= */}

            <div className={styles.inputGroup}>
              <input
                name="street"
                value={address.street}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=""
              />

              <label>
                Street Address
              </label>

              {errors.street && (
                <span className={styles.error}>
                  {errors.street}
                </span>
              )}
            </div>

            {/* ================= APARTMENT ================= */}

            <div className={styles.inputGroup}>
              <input
                name="apartment"
                value={address.apartment}
                onChange={handleChange}
                placeholder=""
              />

              <label>
                Apartment / Suite
                (Optional)
              </label>
            </div>

            {/* ================= CITY ROW ================= */}

            <div className={styles.row}>

              <div className={styles.inputGroup}>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder=""
                />

                <label>City</label>

                {errors.city && (
                  <span
                    className={styles.error}
                  >
                    {errors.city}
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  value={address.district}
                  readOnly
                  placeholder=""
                />

                <label>
                  District
                </label>
              </div>

              <div className={styles.inputGroup}>
                <input
                  value={address.state}
                  readOnly
                  placeholder=""
                />

                <label>State</label>
              </div>

              <div className={styles.inputGroup}>
                <input
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder=""
                />

                <label>
                  Pincode
                </label>

                {errors.pincode && (
                  <span
                    className={styles.error}
                  >
                    {errors.pincode}
                  </span>
                )}
              </div>

            </div>

            {/* ================= STATUS ================= */}

            {deliveryStatus ===
              "checking" && (
              <span
                className={styles.loading}
              >
                Checking delivery...
              </span>
            )}

            {deliveryStatus ===
              "error" && (
              <div
                className={
                  styles.locationErrorBox
                }
              >
                ❌ {errorMsg}
              </div>
            )}

            {deliveryStatus ===
              "success" && (
              <div
                className={
                  styles.locationBox
                }
              >
                <strong>
                  Delivery Available
                </strong>

                <p>
                  {address.district},{" "}
                  {address.state}
                </p>
              </div>
            )}

            {/* ================= BUTTON ================= */}

            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={
                !isFormValid()
                  ? styles.disabledBtn
                  : ""
              }
            >
              Continue to Payment →
            </button>

          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <div className={styles.summary}>
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div
              key={item.product._id}
              className={
                styles.summaryItem
              }
            >
              <span>
                {item.product.name}
              </span>

              <span>
                x{item.quantity}
              </span>
            </div>
          ))}

          <div className={styles.total}>
            <span>Total</span>

            <span>
              ₹{total()}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Checkout;