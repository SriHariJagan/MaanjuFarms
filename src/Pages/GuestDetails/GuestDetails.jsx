import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./GuestDetails.module.css";
import { useVillas } from "../../Store/useContext";
import { ArrowLeft, Plus, User, Users } from "lucide-react";

const GuestDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookVilla } = useVillas();
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <div className={styles.invalidContainer}>
        <div className={styles.invalidCard}>
          <h2>Invalid Access</h2>
          <p>This page cannot be accessed directly. Please start your booking from the villas page.</p>
          <button onClick={() => navigate("/")} className={styles.primaryBtn}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const { villa, checkIn, checkOut, guests, totalPrice } = state;

  const storageKey = useMemo(
    () => `guestDetails_${villa._id}_${checkIn}_${checkOut}`,
    [villa._id, checkIn, checkOut],
  );

  const [guestList, setGuestList] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [{ name: "", age: "", gender: "" }];
  });

  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(guestList));
  }, [guestList, storageKey]);

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

  const isValid = useMemo(() => {
    return (
      guestList.length === guests &&
      guestList.every((g) => g.name.trim().length >= 3 && Number(g.age) > 0 && g.gender)
    );
  }, [guestList, guests]);

  const handleContinue = async () => {
    if (!isValid) {
      setError("Please fill all guest details correctly");
      return;
    }
    try {
      setLoading(true);
      await bookVilla(villa._id, checkIn, checkOut, guests, guestList);
      localStorage.removeItem(storageKey);
    } catch (err) {
      setError("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/villas", {
      state: {
        restoreBooking: true,
        bookingData: { villa, checkIn, checkOut, guests },
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <motion.div
          className={styles.topBar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <button onClick={handleBack} className={styles.backBtn}>
            <ArrowLeft size={16} />
            Back to Booking
          </button>
          <span className={styles.stepText}>Step 2 of 3</span>
        </motion.div>

        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Users size={28} className={styles.headerIcon} />
          <h1>Guest Details</h1>
          <p>
            Add {guests} {guests === 1 ? "guest" : "guests"} details
          </p>
        </motion.div>

        <div className={styles.guestList}>
          {guestList.map((g, i) => (
            <motion.div
              key={i}
              className={styles.guestCard}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className={styles.cardHeader}>
                <h3><User size={16} /> Guest {i + 1}</h3>
                {guestList.length > 1 && (
                  <button className={styles.removeBtn} onClick={() => removeGuest(i)}>
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
            </motion.div>
          ))}
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <div className={styles.actions}>
          <button
            className={styles.addBtn}
            disabled={guestList.length >= guests}
            onClick={addGuest}
          >
            <Plus size={16} />
            Add Guest
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
