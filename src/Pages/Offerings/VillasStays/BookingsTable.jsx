import React from "react";
import styles from "./VillasStays.module.css";

const getStatus = (b) => {
  const now = new Date();
  if (now < new Date(b.checkIn)) return "Upcoming";
  if (now > new Date(b.checkOut)) return "Completed";
  return "Ongoing";
};

const BookingsTable = ({ bookings }) => {
  return (
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
              <td>{b.room?.name}</td>
              <td>{b.user?.name}</td>
              <td>{new Date(b.checkIn).toLocaleDateString()}</td>
              <td>{new Date(b.checkOut).toLocaleDateString()}</td>
              <td>{getStatus(b)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;