import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Leaf } from "lucide-react";
import styles from "./OurCategories.module.css";
import { categories } from "../../../data.js";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const OurCategories = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className={styles.decorator}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className={styles.line} />
            <Leaf size={16} className={styles.leafIcon} />
            <span className={styles.line} />
          </motion.div>
          <h2 className={styles.title}>Explore Our Categories</h2>
          <p className={styles.subtitle}>
            Discover pure, farm-fresh products crafted with tradition and care.
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              className={`${styles.card} ${index === 0 ? styles.featured : ""} ${index === categories.length - 1 ? styles.wide : ""}`}
              variants={cardVariant}
              onClick={() => navigate("/organic-products")}
            >
              <div className={styles.imageWrapper}>
                <img src={cat.image} alt={cat.title} loading="lazy" />
                <div className={styles.overlay} />
                <div className={styles.gradientOverlay} />
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{cat.title}</h3>
                  <p className={styles.cardDesc}>{cat.description}</p>
                  <span className={styles.cardAction}>
                    {cat.buttonText}
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurCategories;
