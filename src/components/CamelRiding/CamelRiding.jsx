import React, { useState } from "react";
import styles from "./camelRiding.module.css";

const images = [
  "/images/camel1.webp",
  "/images/camel2.webp",
  "/images/camel3.webp",
  "/images/camel4.webp",
];

const CamelRiding = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className={styles.camelPage}>
      {/* 🌟 Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Camel Riding at Maanjoo Farms</h1>
          <p>
            Discover the desert like never before with our camel riding
            experiences. From gentle rides to cultural evenings, enjoy Rajasthan’s
            heritage in the most authentic way.
          </p>
        </div>
      </section>

      {/* 🐪 About Section */}
      <section className={styles.about}>
        <h2>About Our Camel Rides</h2>
        <p>
          At <strong>Maanjoo Farms</strong>, camel riding is a traditional way to
          explore the sandy dunes and farmlands of Rajasthan. Our
          <strong>healthy, well-trained camels</strong> and expert handlers ensure
          a safe and memorable journey for families, groups, and solo travelers.
        </p>
      </section>

      {/* 🎯 Why Choose */}
      <section className={styles.whyChoose}>
        <h2>Why Ride With Us?</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>🐪 Friendly Camels</h3>
            <p>
              Ride well-trained camels that are safe and comfortable for all age
              groups.
            </p>
          </div>
          <div className={styles.card}>
            <h3>🎓 Experienced Guides</h3>
            <p>
              Our camel handlers share stories, history, and culture during the
              journey.
            </p>
          </div>
          <div className={styles.card}>
            <h3>🌅 Desert Sunsets</h3>
            <p>
              Witness magical Rajasthan sunsets while riding through dunes and
              trails.
            </p>
          </div>
        </div>
      </section>

      {/* 📅 Packages */}
      <section className={styles.packages}>
        <h2>Camel Riding Experiences</h2>
        <ul className={styles.packageList}>
          <li>
            <strong>Short Village Rides:</strong> 15-30 min camel walks through
            farmlands & local villages.
          </li>
          <li>
            <strong>Desert Safari:</strong> 1-2 hr camel safari across dunes with
            guide.
          </li>
          <li>
            <strong>Cultural Evening:</strong> Camel ride + Rajasthani folk music
            & dinner.
          </li>
          <li>
            <strong>Family Packages:</strong> Safe rides tailored for groups &
            children.
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
              alt={`Camel Riding ${i + 1}`}
              onClick={() => setSelectedImage(src)}
            />
          ))}
        </div>
      </section>

      {/* 🔍 Popup Lightbox */}
      {selectedImage && (
        <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Selected Camel Ride" />
        </div>
      )}

      {/* 📍 Call to Action */}
      <section className={styles.cta}>
        <h2>Plan Your Camel Safari</h2>
        <p>Book your camel riding adventure at Maanjoo Farms today.</p>
        <button>Contact Us</button>
      </section>
    </div>
  );
};

export default CamelRiding;
