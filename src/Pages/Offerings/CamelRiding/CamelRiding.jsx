import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./camelRiding.module.css";
import { Link } from "react-router-dom";

const images = [
  "/Images/camels/camel1.webp",
  "/Images/camels/camel2.jpeg",
  "/Images/camels/camel3.jpeg",
  "/Images/camels/camel4.jpeg",
];

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.6 } } };

const CamelRiding = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <motion.div className={styles.camelPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <motion.section className={styles.hero} variants={fadeIn} initial="initial" animate="animate">
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <motion.span className={styles.badge}>Adventure</motion.span>
          <motion.h1>Camel Riding at Maanjoo Farms</motion.h1>
          <motion.p>
            Discover the desert like never before with our camel riding experiences. From gentle rides to cultural evenings, enjoy Rajasthan heritage in the most authentic way.
          </motion.p>
        </div>
      </motion.section>

      <motion.section className={styles.sectionAlt} variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
        <div className={styles.contentInner}>
          <span className={styles.sectionBadge}>Our Tradition</span>
          <h2>About Our Camel Rides</h2>
          <p>
            At <strong>Maanjoo Farms</strong>, camel riding is a traditional way to explore the sandy dunes and farmlands of Rajasthan. Our <strong>healthy, well-trained camels</strong> and expert handlers ensure a safe and memorable journey for families, groups, and solo travelers.
          </p>
        </div>
      </motion.section>

      <motion.section className={styles.section} variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}>
        <div className={styles.contentInner}>
          <span className={styles.sectionBadge}>Why Choose Us</span>
          <h2>Why Ride With Us?</h2>
          <div className={styles.cards}>
            {[
              { icon: "🐪", title: "Friendly Camels", text: "Ride well-trained camels that are safe and comfortable for all age groups." },
              { icon: "🎓", title: "Experienced Guides", text: "Our camel handlers share stories, history, and culture during the journey." },
              { icon: "🌅", title: "Desert Sunsets", text: "Witness magical Rajasthan sunsets while riding through dunes and trails." },
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
          <h2>Camel Riding Experiences</h2>
          <ul className={styles.packageList}>
            {[
              { title: "Short Village Rides", desc: "15-30 min camel walks through farmlands & local villages." },
              { title: "Desert Safari", desc: "1-2 hr camel safari across dunes with guide." },
              { title: "Cultural Evening", desc: "Camel ride + Rajasthani folk music & dinner." },
              { title: "Family Packages", desc: "Safe rides tailored for groups & children." },
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
              <motion.img key={i} src={src} alt={`Camel Riding ${i + 1}`} onClick={() => setSelectedImage(src)} variants={fadeUp} whileHover={{ scale: 1.05 }} />
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
          <h2>Plan Your Camel Safari</h2>
          <p>Book your camel riding adventure at Maanjoo Farms today.</p>
          <Link to="/contact"><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Contact Us</motion.button></Link>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default CamelRiding;
