import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, X, Star, Clock, Users, Shield } from "lucide-react";
import styles from "./horseRiding.module.css";

const images = [
  "/Images/horse/horse1.jpeg",
  "/Images/horse/horse2.jpeg",
  "/Images/horse/horse3.jpeg",
  "/Images/horse/horse4.jpeg",
];

const stagger = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const features = [
  {
    icon: Shield,
    title: "Trained Horses",
    desc: "Ride Rajasthan's famous Marwari horses with unique inward-curved ears.",
  },
  {
    icon: Star,
    title: "Expert Trainers",
    desc: "Our professional horsemen ensure safe and enjoyable rides for all levels.",
  },
  {
    icon: Clock,
    title: "Scenic Routes",
    desc: "Explore farmlands, desert trails, and village paths around Pilani.",
  },
  {
    icon: Users,
    title: "All Levels Welcome",
    desc: "From beginners to experienced riders, everyone finds their perfect ride.",
  },
];

const packages = [
  { title: "Beginner Rides", desc: "15-30 min farm rides with trainer guidance." },
  { title: "Desert Trails", desc: "1-2 hr guided rides across dunes & farmlands." },
  { title: "Royal Experience", desc: "Evening ride + cultural Rajasthani dinner." },
  { title: "Training Sessions", desc: "Learn basic horse care & riding skills." },
];

const HorseRiding = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroGrain} />
        <div className={styles.heroContent}>
          <motion.span
            className={styles.badge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Leaf size={12} />
            Experience
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Horse Riding at Maanjoo Farms
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            Experience the thrill of horse riding in the heart of Rajasthan.
            Whether you are a beginner or an expert, our trained horses and
            professional instructors ensure a safe, enjoyable, and unforgettable
            journey.
          </motion.p>
        </div>
      </section>

      {/* About */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <motion.div
            className={styles.sectionBadge}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Our Heritage
          </motion.div>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            About Our Horse Riding
          </motion.h2>
          <motion.p
            className={styles.sectionText}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            At <strong>Maanjoo Farms</strong>, horse riding is more than just an
            activity — it is a journey into Rajasthan's cultural heritage. We
            house <strong>pure Marwari and Kathiawari horses</strong>, known for
            their strength, beauty, and loyalty. Guided by professional trainers,
            our rides are safe, adventurous, and designed for all levels — from
            beginners to experienced riders.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.inner}>
          <motion.div
            className={styles.sectionBadge}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Why Choose Us
          </motion.div>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Ride With Us?
          </motion.h2>
          <motion.div
            className={styles.featuresGrid}
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((f, i) => (
              <motion.div className={styles.featureCard} key={i} variants={fadeUp}>
                <span className={styles.featureIcon}>
                  <f.icon size={20} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <motion.div
            className={styles.sectionBadge}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Packages
          </motion.div>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Riding Experiences
          </motion.h2>
          <motion.div
            className={styles.packagesGrid}
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {packages.map((p, i) => (
              <motion.div className={styles.packageCard} key={i} variants={fadeUp}>
                <div className={styles.packageNumber}>{String(i + 1).padStart(2, "0")}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.inner}>
          <motion.div
            className={styles.sectionBadge}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Gallery
          </motion.div>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Moments at the Farm
          </motion.h2>
          <motion.div
            className={styles.galleryGrid}
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {images.map((src, i) => (
              <motion.div
                key={i}
                className={styles.galleryItem}
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedImage(src)}
              >
                <img src={src} alt={`Horse Riding ${i + 1}`} loading="lazy" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className={styles.lightbox}
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className={styles.lightboxClose}
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <motion.img
              src={selectedImage}
              alt="Selected"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <motion.section
        className={styles.cta}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.inner}>
          <h2>Plan Your Ride</h2>
          <p>Book your horse riding experience at Maanjoo Farms today.</p>
          <Link to="/contact">
            <motion.button
              className={styles.ctaBtn}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Contact Us
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HorseRiding;
