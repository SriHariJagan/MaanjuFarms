import React, { useState } from "react";
import styles from "./VillasStays.module.css";

const villas = [
  {
    id: 1,
    title: "Thar Olive Cottage",
    description:
      "A cozy cottage surrounded by olive trees, offering a peaceful retreat with modern amenities.",
    image: "/images/olive-cottage.jpg",
  },
  {
    id: 2,
    title: "Date Palm Villa",
    description:
      "Spacious villa nestled among date palms, providing a luxurious stay with scenic views.",
    image: "/images/date-palm-villa.jpg",
  },
  {
    id: 3,
    title: "Sweet Lime Suite",
    description:
      "Elegant suite overlooking sweet lime orchards, perfect for relaxation and rejuvenation.",
    image: "/images/sweet-lime-suite.jpg",
  },
];

const VillasStays = () => {
  const [selectedVilla, setSelectedVilla] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState(null);

  const handleCheckAvailability = () => {
    if (checkIn && checkOut) {
      // Simulate availability check
      setAvailability("Available");
    } else {
      setAvailability("Please select dates");
    }
  };

  const handleCloseModal = () => {
    setSelectedVilla(null);
    setAvailability(null);
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
  };

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

        <div className={styles.villasGrid}>
          {villas.map((villa) => (
            <div key={villa.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={villa.image} alt={villa.title} />
              </div>
              <div className={styles.content}>
                <h3>{villa.title}</h3>
                <p>{villa.description}</p>
                <button
                  className={styles.btn}
                  onClick={() => setSelectedVilla(villa)}
                >
                  Check Availability
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedVilla && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={handleCloseModal}>
              ✖
            </button>
            <h3>{selectedVilla.title}</h3>
            <div className={styles.modalContent}>
              <label>
                Check-In:
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </label>
              <label>
                Check-Out:
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </label>
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
              <button className={styles.btn} onClick={handleCheckAvailability}>
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
                <button className={styles.bookBtn}>Book Now</button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VillasStays;
