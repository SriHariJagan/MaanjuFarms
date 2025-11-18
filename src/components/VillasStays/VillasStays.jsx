import React, { useState, useEffect } from "react";
import styles from "./VillasStays.module.css";
import { useVillas } from "../../Store/useContext";
import { useAuth } from "../../Store/useContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

const VillasStays = () => {
  const {
    villas,
    bookings,
    loading,
    error,
    fetchVillas,
    bookVilla,
    updateVilla,
  } = useVillas();
  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [selectedVilla, setSelectedVilla] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState(null);
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    fetchVillas();
  }, []);

  // Get current villa status for grid display
  const getVillaStatus = (villa) => {
    if (villa.status === "maintenance") return "Maintenance";

    const today = new Date();
    const bookedToday = bookings.some(
      (b) =>
        b.room?._id === villa._id &&
        new Date(b.checkIn) <= today &&
        today <= new Date(b.checkOut)
    );

    return bookedToday ? "Booked" : "Available";
  };

  // Generate booked dates for the selected villa
  const getBookedDates = () => {
    if (!selectedVilla) return [];
    let dates = [];
    bookings
      .filter((b) => b.room?._id === selectedVilla._id)
      .forEach((b) => {
        let start = new Date(b.checkIn);
        let end = new Date(b.checkOut);
        while (start <= end) {
          dates.push(new Date(start).toISOString().split("T")[0]);
          start.setDate(start.getDate() + 1);
        }
      });
    return dates;
  };

  // Check availability for selected dates
  // Check availability for selected dates
  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut) {
      setAvailability("Please select check-in and check-out dates");
      toast.warn("Please select check-in and check-out dates", {
        toastId: "select-dates",
      });
      return;
    }

    const today = new Date();
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (inDate < today.setHours(0, 0, 0, 0)) {
      setAvailability("Check-in cannot be in the past");
      toast.error("Check-in cannot be in the past", {
        toastId: "past-checkin",
      });
      return;
    }

    if (outDate <= inDate) {
      setAvailability("Check-out must be after check-in");
      toast.error("Check-out must be after check-in", {
        toastId: "invalid-range",
      });
      return;
    }

    if (selectedVilla.status === "maintenance") {
      setAvailability("Villa unavailable (Maintenance)");
      toast.info("Villa is under maintenance", {
        toastId: `maintenance-${selectedVilla._id}`,
      });
      return;
    }

    // ✅ Get all bookings for this villa
    const villaBookings = bookings.filter(
      (b) => b.room?._id === selectedVilla._id
    );

    // ✅ Check for overlapping bookings (exact same logic as backend)
    const isOverlapping = villaBookings.some((booking) => {
      const existingCheckIn = new Date(booking.checkIn);
      const existingCheckOut = new Date(booking.checkOut);
      // Overlap condition:
      return existingCheckIn < outDate && existingCheckOut > inDate;
    });

    if (isOverlapping) {
      setAvailability("Villa already booked for selected dates");
      toast.info("Villa is already booked for these dates", {
        toastId: `booked-${selectedVilla._id}`,
      });
    } else {
      setAvailability("Available");
      toast.success("Villa is available for selected dates", {
        toastId: `available-${selectedVilla._id}`,
      });
    }
  };

  // Book villa
  const handleBookNow = async () => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (availability !== "Available") {
      toast.error("Villa is not available for the selected dates", {
        toastId: `not-available-${selectedVilla._id}`,
      });
      return;
    }

    const res = await bookVilla(selectedVilla._id, checkIn, checkOut);
    if (res.success) {
      setBookingStatus("Villa booked successfully!");
      setAvailability(null);
      setSelectedVilla(null);
      setCheckIn("");
      setCheckOut("");
      setGuests(1);
    } else {
      setBookingStatus(res.msg || "Booking failed");
      console.log("Booking failed:", res);
    }
  };

  const handleOpenModal = (villa) => {
    if (!user || !token) {
      navigate("/login");
      return;
    }
    setSelectedVilla(villa);
    setAvailability(null);
    setBookingStatus("");
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
  };

  const handleCloseModal = () => {
    setSelectedVilla(null);
    setAvailability(null);
    setBookingStatus("");
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
  };

  const handleStatusChange = async (villaId, newStatus) => {
    if (!isAdmin) return;
    await updateVilla(villaId, { status: newStatus });
  };

  // Helper to disable booked dates in the date picker
  const isDateDisabled = (date) => {
    const bookedDates = getBookedDates();
    return bookedDates.includes(date);
  };

  if (loading) return <p>Loading villas...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <section className={styles.villasSection}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h2 className={styles.heading}>Villas & Stays at Maanjoo Farms</h2>
          <p className={styles.subtext}>
            Immerse yourself in the tranquility of Maanjoo Farms with our
            exclusive stays. Each villa is designed to offer comfort, luxury,
            and a connection to nature.
          </p>
        </div>

        {/* Villas Grid */}
        <div className={styles.villasGrid}>
          {villas.map((villa) => (
            <div key={villa._id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={villa.image} alt={villa.name || villa.title} />
              </div>
              <div className={styles.content}>
                <h3>{villa.name || villa.title}</h3>
                <p>{villa.description}</p>
                <p>
                  Status:{" "}
                  <span
                    className={
                      getVillaStatus(villa) === "Available"
                        ? styles.available
                        : styles.unavailable
                    }
                  >
                    {getVillaStatus(villa)}
                  </span>
                </p>

                {isAdmin && (
                  <select
                    className={styles.statusSelect}
                    value={villa.status}
                    onChange={(e) =>
                      handleStatusChange(villa._id, e.target.value)
                    }
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                )}

                <button
                  className={styles.btn}
                  onClick={() => handleOpenModal(villa)}
                >
                  Check Availability
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Bookings Table */}
        {isAdmin && bookings.length > 0 && (
          <div className={styles.bookingsTableWrapper}>
            <h2 className={styles.tableHeading}>All Bookings</h2>
            <table className={styles.bookingsTable}>
              <thead>
                <tr>
                  <th>Villa</th>
                  <th>User</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.room?.name || "N/A"}</td>
                    <td>{b.user?.name || "Unknown"}</td>
                    <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                    <td>
                      {new Date() < new Date(b.checkIn)
                        ? "Upcoming"
                        : new Date() > new Date(b.checkOut)
                        ? "Completed"
                        : "Ongoing"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Booking Modal */}
        {selectedVilla && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button className={styles.closeBtn} onClick={handleCloseModal}>
                ✖
              </button>
              <h3>{selectedVilla.name || selectedVilla.title}</h3>
              <div className={styles.modalContent}>
                {/* Date Pickers Row */}
                <div className={styles.dateRow}>
                  <label>
                    Check-In:
                    <DatePicker
                      selected={checkIn ? new Date(checkIn) : null}
                      onChange={(date) =>
                        setCheckIn(date.toISOString().split("T")[0])
                      }
                      minDate={new Date()}
                      excludeDates={getBookedDates().map((d) => new Date(d))}
                      placeholderText="Select check-in date"
                      dateFormat="yyyy-MM-dd"
                      className={styles.datePicker}
                      onFocus={(e) => e.target.blur()}
                    />
                  </label>
                  <label>
                    Check-Out:
                    <DatePicker
                      selected={checkOut ? new Date(checkOut) : null}
                      onChange={(date) =>
                        setCheckOut(date.toISOString().split("T")[0])
                      }
                      minDate={checkIn ? new Date(checkIn) : new Date()}
                      excludeDates={getBookedDates().map((d) => new Date(d))}
                      placeholderText="Select check-out date"
                      dateFormat="yyyy-MM-dd"
                      className={styles.datePicker}
                      onFocus={(e) => e.target.blur()}
                    />
                  </label>
                </div>

                {/* Guests */}
                <label>
                  Guests:
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </label>

                <button
                  className={styles.btn}
                  onClick={handleCheckAvailability}
                  disabled={selectedVilla.status === "maintenance"}
                >
                  Check Availability
                </button>

                {availability && (
                  <p
                    className={
                      availability === "Available"
                        ? styles.available
                        : styles.unavailable
                    }
                  >
                    {availability}
                  </p>
                )}

                {availability === "Available" && (
                  <button className={styles.bookBtn} onClick={handleBookNow}>
                    Book Now
                  </button>
                )}

                {bookingStatus && (
                  <p
                    className={
                      bookingStatus.includes("success")
                        ? styles.available
                        : styles.unavailable
                    }
                  >
                    {bookingStatus}
                  </p>
                )}

                {/* Upcoming Bookings */}
                <div className={styles.upcomingBookings}>
                  <h4>Upcoming Bookings</h4>
                  {bookings
                    .filter(
                      (b) =>
                        b.room?._id === selectedVilla._id &&
                        new Date(b.checkOut) >= new Date()
                    )
                    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
                    .map((b) => (
                      <div key={b._id} className={styles.bookingItem}>
                        <span>
                          {new Date(b.checkIn).toLocaleDateString()} →{" "}
                          {new Date(b.checkOut).toLocaleDateString()}
                        </span>
                        <span>{b.user?.name || "Unknown"}</span>
                      </div>
                    ))}
                  {bookings.filter(
                    (b) =>
                      b.room?._id === selectedVilla._id &&
                      new Date(b.checkOut) >= new Date()
                  ).length === 0 && <p>No upcoming bookings for this villa.</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VillasStays;
