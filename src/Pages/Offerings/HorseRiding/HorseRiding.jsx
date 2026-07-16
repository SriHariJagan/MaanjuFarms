import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./horseRiding.module.css";
import { Link } from "react-router-dom";

const images = [
  "/Images/horse/horse1.jpeg",
  "/Images/horse/horse2.jpeg",
  "/Images/horse/horse3.jpeg",
  "/Images/horse/horse4.jpeg",
];

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.6 } } };

const HorseRiding = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <motion.div className={styles.horsePage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <motion.section className={styles.hero} variants={fadeIn} initial="initial" animate="animate">
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <motion.span className={styles.badge}>Experience</motion.span>
          <motion.h1>Horse Riding at Maanjoo Farms</motion.h1>
          <motion.p variants={fadeUp}>
            Experience the thrill of horse riding in the heart of Rajasthan. Whether you are a beginner or an expert, our trained horses and professional instructors ensure a safe, enjoyable, and unforgettable journey.
          </motion.p>
        </div>
      </motion.section>

      <motion.section className={styles.sectionAlt} variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
        <div className={styles.contentInner}>
          <span className={styles.sectionBadge}>Our Heritage</span>
          <h2>About Our Horse Riding</h2>
          <p>
            At <strong>Maanjoo Farms</strong>, horse riding is more than just an activity — it is a journey into Rajasthan cultural heritage. We house <strong>pure Marwari and Kathiawari horses</strong>, known for their strength, beauty, and loyalty. Guided by professional trainers, our rides are safe, adventurous, and designed for all levels — from beginners to experienced riders.
          </p>
        </div>
      </motion.section>

      <motion.section className={styles.section} variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}>
        <div className={styles.contentInner}>
          <span className={styles.sectionBadge}>Why Choose Us</span>
          <h2>Why Ride With Us?</h2>
          <div className={styles.cards}>
            {[
              { icon: "🐎", title: "Trained Horses", text: "Ride Rajasthan famous Marwari horses with unique inward-curved ears." },
              { icon: "🎓", title: "Expert Trainers", text: "Our professional horsemen ensure safe and enjoyable rides for all levels." },
              { icon: "🌅", title: "Scenic Routes", text: "Explore farmlands, desert trails, and village paths around Pilani." },
            ].map((c, i) => (
              <motion.div className={styles.card} key={i} variants={fadeUp}>
                <div className={styles.cardIcon}>{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className={styles.sectionAlt} variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
        <div className={styles.contentInner}>
          <span className={styles.sectionBadge}>Packages</span>
          <h2>Riding Experiences</h2>
          <ul className={styles.packageList}>
            {[
              { title: "Beginner Rides", desc: "15-30 min farm rides with trainer guidance." },
              { title: "Desert Trails", desc: "1-2 hr guided rides across dunes & farmlands." },
              { title: "Royal Experience", desc: "Evening ride + cultural Rajasthani dinner." },
              { title: "Training Sessions", desc: "Learn basic horse care & riding skills." },
            ].map((p, i) => (
              <motion.li key={i} variants={fadeUp} className={styles.packageItem}>
                <div className={styles.packageDot} />
                <div>
                  <strong>{p.title}:</strong> {p.desc}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.section>

      <motion.section className={styles.section} variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}>
        <div className={styles.contentInner}>
          <span className={styles.sectionBadge}>Gallery</span>
          <h2>Gallery</h2>
          <div className={styles.grid}>
            {images.map((src, i) => (
              <motion.img key={i} src={src} alt={`Horse Riding ${i + 1}`} onClick={() => setSelectedImage(src)} variants={fadeUp} whileHover={{ scale: 1.05 }} />
            ))}
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div className={styles.lightbox} onClick={() => setSelectedImage(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.img src={selectedImage} alt="Selected" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section className={styles.cta} variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
        <div className={styles.contentInner}>
          <h2>Plan Your Ride</h2>
          <p>Book your horse riding experience at Maanjoo Farms today.</p>
          <Link to="/contact"><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Contact Us</motion.button></Link>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HorseRiding;
