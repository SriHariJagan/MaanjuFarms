import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./GuestDetails.module.css";

import { useVillas } from "../../Store/useContext";

const GuestDetails = () => {
  const { state } = useLocation();

  /* ================= INVALID ACCESS ================= */
  if (!state) {
    return (
      <div className={styles.invalidContainer}>
        <div className={styles.invalidCard}>
          <h2>⚠️ Invalid Access</h2>
          <p>
            This page cannot be accessed directly. Please start your booking
            from the villas page.
          </p>
          <button onClick={() => navigate("/")} className={styles.primaryBtn}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const navigate = useNavigate();
  const { bookVilla } = useVillas();
  const [loading, setLoading] = useState(false);

  const { villa, checkIn, checkOut, guests, totalPrice } = state;

  /* ================= UNIQUE STORAGE KEY ================= */
  const storageKey = useMemo(
    () => `guestDetails_${villa._id}_${checkIn}_${checkOut}`,
    [villa._id, checkIn, checkOut],
  );

  /* ================= STATE ================= */
  const [guestList, setGuestList] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [{ name: "", age: "", gender: "" }];
  });

  const [error, setError] = useState("");

  /* ================= AUTO SAVE ================= */
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(guestList));
  }, [guestList, storageKey]);

  /* ================= HANDLERS ================= */

  const handleChange = (index, field, value) => {
    const updated = [...guestList];
    updated[index][field] = value;
    setGuestList(updated);
  };

  const addGuest = () => {
    if (guestList.length >= guests) return;
    setGuestList((prev) => [...prev, { name: "", age: "", gender: "" }]);
  };

  const removeGuest = (index) => {
    if (guestList.length === 1) return;
    setGuestList((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= VALIDATION ================= */

  const isValid = useMemo(() => {
    return (
      guestList.length === guests &&
      guestList.every(
        (g) => g.name.trim().length >= 3 && Number(g.age) > 0 && g.gender,
      )
    );
  }, [guestList, guests]);

  /* ================= CONTINUE ================= */

  const handleContinue = async () => {
    if (!isValid) {
      setError("Please fill all guest details correctly");
      return;
    }

    try {
      setLoading(true);

      await bookVilla(
        villa._id,
        checkIn,
        checkOut,
        guests,
        guestList, // ✅ SEND GUEST DETAILS
      );

      // clear saved data after success
      localStorage.removeItem(storageKey);
    } catch (err) {
      setError("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BACK ================= */

  const handleBack = () => {
    navigate("/villas", {
      state: {
        restoreBooking: true,
        bookingData: {
          villa,
          checkIn,
          checkOut,
          guests,
        },
      },
    });
  };

  /* ================= UI ================= */

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* TOP BAR */}
        <div className={styles.topBar}>
          <button onClick={handleBack} className={styles.backBtn}>
            <span className={styles.backIcon}>←</span>
            <span>Back to Booking</span>
          </button>

          <span className={styles.stepText}>Step 2 of 3</span>
        </div>

        {/* HEADER */}
        <div className={styles.header}>
          <h1>Guest Details</h1>
          <p>
            Add {guests} {guests === 1 ? "guest" : "guests"} details
          </p>
        </div>

        {/* GUEST LIST */}
        <div className={styles.guestList}>
          {guestList.map((g, i) => (
            <div key={i} className={styles.guestCard}>
              <div className={styles.cardHeader}>
                <h3>Guest {i + 1}</h3>

                {guestList.length > 1 && (
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeGuest(i)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className={styles.formRow}>
                <input
                  placeholder="Full Name"
                  value={g.name}
                  onChange={(e) => handleChange(i, "name", e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Age"
                  value={g.age}
                  onChange={(e) => handleChange(i, "age", e.target.value)}
                />

                <select
                  value={g.gender}
                  onChange={(e) => handleChange(i, "gender", e.target.value)}
                >
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* ERROR */}
        {error && <div className={styles.errorBox}>⚠️ {error}</div>}

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button
            className={styles.addBtn}
            disabled={guestList.length >= guests}
            onClick={addGuest}
          >
            + Add Guest
          </button>

          <button
            className={styles.continueBtn}
            disabled={!isValid || loading}
            onClick={handleContinue}
          >
            {loading ? "Redirecting to Payment..." : "Continue to Payment →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestDetails;
