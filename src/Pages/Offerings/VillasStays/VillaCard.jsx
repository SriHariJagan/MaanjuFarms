import React from "react";
import styles from "./VillasStays.module.css";

const VillaCard = ({
  villa,
  bookings,
  isAdmin,
  onOpenBooking,
  onEdit,
  onStatusChange,
}) => {
  const getStatus = () => {
    if (villa.status === "maintenance") return "Maintenance";

    const today = new Date();

    const booked = bookings.some((b) => {
      if (b.room?._id !== villa._id) return false;

      const inDate = new Date(b.checkIn);
      const outDate = new Date(b.checkOut);

      return inDate <= today && today <= outDate;
    });

    return booked ? "Booked for Today" : "Available";
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={villa.image} alt={villa.name} />
      </div>

      <div className={styles.content}>
        <h3>{villa.name}</h3>
        <p>{villa.description}</p>

        <p>Type: {villa.type}</p>
        <p>₹{villa.price} / night</p>

        <p>
          Status:{" "}
          <span
            className={
              getStatus() === "Available"
                ? styles.available
                : styles.unavailable
            }
          >
            {getStatus()}
          </span>
        </p>

        <div className={styles.actions}>
          <button onClick={onOpenBooking} className={styles.bookBtn}>
            Check Availability
          </button>

          {isAdmin && (
            <div className={styles.adminActions}>
              <button onClick={onEdit} className={styles.editBtn}>
                ✏️ Edit
              </button>

              <select
                value={villa.status}
                onChange={(e) =>
                  onStatusChange(villa._id, {
                    status: e.target.value,
                  })
                }
                className={styles.statusSelect}
              >
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VillaCard;
