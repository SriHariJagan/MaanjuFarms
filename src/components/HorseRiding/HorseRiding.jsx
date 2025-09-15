import React, { useState } from "react";
import styles from "./horseRiding.module.css";

const images = [
  "/images/horse1.webp",
  "/images/horse1.webp",
  "/images/horse1.webp",
  "/images/horse1.webp",
];

const HorseRiding = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className={styles.horsePage}>
      {/* 🌟 Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Horse Riding at Maanjoo Farms</h1>
          <p>
            Experience the thrill of horse riding in the heart of Rajasthan.
            Whether you’re a beginner or an expert, our trained horses and
            professional instructors ensure a safe, enjoyable, and unforgettable
            journey.
          </p>
        </div>
      </section>

      {/* 🐎 About Section */}
      <section className={styles.about}>
        <h2>About Our Horse Riding</h2>
        <p>
          At <strong>Maanjoo Farms</strong>, horse riding is more than just an
          activity — it’s a journey into Rajasthan’s cultural heritage. We house
          <strong>pure Marwari and Kathiawari horses</strong>, known for their
          strength, beauty, and loyalty. Guided by professional trainers, our
          rides are safe, adventurous, and designed for all levels — from
          beginners to experienced riders.
        </p>
      </section>

      {/* 🎯 Why Choose */}
      <section className={styles.whyChoose}>
        <h2>Why Ride With Us?</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>🐎 Trained Horses</h3>
            <p>
              Ride Rajasthan’s famous Marwari horses with unique inward-curved
              ears.
            </p>
          </div>
          <div className={styles.card}>
            <h3>🎓 Expert Trainers</h3>
            <p>
              Our professional horsemen ensure safe and enjoyable rides for all
              levels.
            </p>
          </div>
          <div className={styles.card}>
            <h3>🌅 Scenic Routes</h3>
            <p>
              Explore farmlands, desert trails, and village paths around Pilani.
            </p>
          </div>
        </div>
      </section>

      {/* 📅 Packages */}
      <section className={styles.packages}>
        <h2>Riding Experiences</h2>
        <ul className={styles.packageList}>
          <li>
            <strong>Beginner Rides:</strong> 15-30 min farm rides with trainer
            guidance.
          </li>
          <li>
            <strong>Desert Trails:</strong> 1-2 hr guided rides across dunes &
            farmlands.
          </li>
          <li>
            <strong>Royal Experience:</strong> Evening ride + cultural
            Rajasthani dinner.
          </li>
          <li>
            <strong>Training Sessions:</strong> Learn basic horse care & riding
            skills.
          </li>
        </ul>
      </section>

      {/* 🖼️ Gallery */}
      <section className={styles.gallery}>
        <h2>Gallery</h2>
        <div className={styles.grid}>
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Horse Riding ${i + 1}`}
              onClick={() => setSelectedImage(src)}
            />
          ))}
        </div>
      </section>

      {/* 🔍 Popup Lightbox */}
      {selectedImage && (
        <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Selected Horse Ride" />
        </div>
      )}

      {/* 📍 Call to Action */}
      <section className={styles.cta}>
        <h2>Plan Your Ride</h2>
        <p>Book your horse riding experience at Maanjoo Farms today.</p>
        <button>Contact Us</button>
      </section>
    </div>
  );
};

export default HorseRiding;
