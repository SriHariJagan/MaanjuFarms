import React from "react";
import { motion } from "framer-motion";
import styles from "./VillasStays.module.css";

const getStatus = (b) => {
  const now = new Date();
  if (now < new Date(b.checkIn)) return "Upcoming";
  if (now > new Date(b.checkOut)) return "Completed";
  return "Ongoing";
};

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

const BookingsTable = ({ bookings }) => {
  return (
    <motion.div className={styles.bookingsTableWrapper} variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
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
    </motion.div>
  );
};

export default BookingsTable;
