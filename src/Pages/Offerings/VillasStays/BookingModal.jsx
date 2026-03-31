import React, { useState, useMemo } from "react";
import styles from "./VillasStays.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const formatDate = (date) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  d.setMinutes(d.getMinutes() - offset);
  return d.toISOString().split("T")[0];
};


const BookingModal = ({
  villa,
  bookings,
  onClose,
  bookVilla,
  user,
  token,
  navigate,
}) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [checkIn, checkOut] = dateRange;
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ================= BOOKED DATES ================= */
  const bookedDates = useMemo(() => {
    return bookings
      .filter((b) => b.room?._id === villa._id)
      .flatMap((b) => {
        const dates = [];
        let d = new Date(b.checkIn);
        const end = new Date(b.checkOut);

        while (d <= end) {
          dates.push(new Date(d));
          d.setDate(d.getDate() + 1);
        }
        return dates;
      });
  }, [bookings, villa._id]);

  /* ================= DATE HANDLER ================= */
  const handleDateChange = (update) => {
    const [start, end] = update;

    if (start && end) {
      const invalid = bookedDates.some(
        (d) => d >= start && d <= end
      );

      if (invalid) {
        toast.error("Selected range includes unavailable dates");
        return setDateRange([start, null]);
      }
    }

    setDateRange(update);
  };

  /* ================= AVAILABILITY ================= */
  const isAvailable = useMemo(() => {
    if (!checkIn || !checkOut) return null;

    return !bookings.some((b) => {
      if (b.room?._id !== villa._id) return false;

      const inDate = new Date(b.checkIn);
      const outDate = new Date(b.checkOut);

      return inDate < checkOut && outDate > checkIn;
    });
  }, [checkIn, checkOut, bookings, villa._id]);

  /* ================= CALCULATIONS ================= */
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const totalPrice = nights * villa.price;

  /* ================= BOOK ================= */
  const handleBookNow = async () => {
    if (!user || !token) return navigate("/login");

    if (!checkIn || !checkOut)
      return toast.error("Select dates");

    if (checkOut <= checkIn)
      return toast.error("Invalid date selection");

    if (!isAvailable)
      return toast.error("Dates not available");

    try {
      setLoading(true);

      await bookVilla(
        villa._id,
        formatDate(checkIn),
        formatDate(checkOut),
        Number(guests)
      );

    } catch (err) {
      toast.error("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.premiumModal}>

        {/* HEADER */}
        <div className={styles.modalHeader}>
          <img src={villa.image} alt={villa.name} />
          <div className={styles.headerInfo}>
            <h2>{villa.name}</h2>
            <p>{villa.type} • ₹{villa.price}/night</p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>✖</button>
        </div>

        {/* BODY */}
        <div className={styles.modalBody}>

          {/* CALENDAR */}
          <div className={styles.calendarWrapper}>
            <h3>Select Dates</h3>

            <DatePicker
              selected={checkIn}
              onChange={handleDateChange}
              startDate={checkIn}
              endDate={checkOut}
              selectsRange
              inline
              minDate={new Date()}
              excludeDates={bookedDates}
              monthsShown={2}
            />
          </div>

          {/* BOOKING CARD */}
          <div className={styles.bookingCard}>

            <div className={styles.priceRow}>
              <h3>₹{villa.price}</h3>
              <span>/ night</span>
            </div>

            <div className={styles.dateBox}>
              <div>
                <label>Check-in</label>
                <p>{checkIn ? checkIn.toDateString() : "--"}</p>
              </div>
              <div>
                <label>Check-out</label>
                <p>{checkOut ? checkOut.toDateString() : "--"}</p>
              </div>
            </div>

            <label className={styles.guestField}>
              Guests
              <input
                type="number"
                min="1"
                max="10"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </label>

            {nights > 0 && (
              <div className={styles.priceBreakdown}>
                <p>₹{villa.price} × {nights} nights</p>
                <h4>Total: ₹{totalPrice}</h4>
              </div>
            )}

            <button
              className={styles.bookBtn}
              disabled={!checkIn || !checkOut || !isAvailable || loading}
              onClick={handleBookNow}
            >
              {loading ? "Redirecting..." : "Reserve"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;