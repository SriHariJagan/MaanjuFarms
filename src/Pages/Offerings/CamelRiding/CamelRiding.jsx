import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Leaf, X, Star, Clock, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./camelRiding.module.css";

const images = [
  "/Images/camels/camel1.webp",
  "/Images/camels/camel2.jpeg",
  "/Images/camels/camel3.jpeg",
  "/Images/camels/camel4.jpeg",
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
    title: "Friendly Camels",
    desc: "Ride well-trained camels safe and comfortable for all age groups.",
  },
  {
    icon: Star,
    title: "Experienced Guides",
    desc: "Our camel handlers share stories, history, and culture during the journey.",
  },
  {
    icon: Clock,
    title: "Desert Sunsets",
    desc: "Witness magical Rajasthan sunsets while riding through dunes and trails.",
  },
  {
    icon: Users,
    title: "Family Friendly",
    desc: "Safe rides tailored for groups, children, and first-time riders.",
  },
];

const packages = [
  { title: "Short Village Rides", desc: "15-30 min camel walks through farmlands & local villages." },
  { title: "Desert Safari", desc: "1-2 hr camel safari across dunes with guide." },
  { title: "Cultural Evening", desc: "Camel ride + Rajasthani folk music & dinner." },
  { title: "Family Packages", desc: "Safe rides tailored for groups & children." },
];

const CamelRiding = () => {
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
            Adventure
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Camel Safari at Maanjoo Farms
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            Discover the desert like never before with our camel riding
            experiences. From gentle rides to cultural evenings, enjoy
            Rajasthan's heritage in the most authentic way.
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
            Our Tradition
          </motion.div>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            About Our Camel Rides
          </motion.h2>
          <motion.p
            className={styles.sectionText}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            At <strong>Maanjoo Farms</strong>, camel riding is a traditional way
            to explore the sandy dunes and farmlands of Rajasthan. Our{" "}
            <strong>healthy, well-trained camels</strong> and expert handlers
            ensure a safe and memorable journey for families, groups, and solo
            travelers.
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
            Camel Riding Experiences
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
                <div className={styles.packageNumber}>
                  {String(i + 1).padStart(2, "0")}
                </div>
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
                <img src={src} alt={`Camel Safari ${i + 1}`} loading="lazy" />
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
          <h2>Plan Your Camel Safari</h2>
          <p>Book your camel riding adventure at Maanjoo Farms today.</p>
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

export default CamelRiding;
