import React from "react";
import styles from "./OurCategories.module.css";
import { categories } from "../../../data.js";

const OurCategories = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.title}>Explore Our Categories</h2>
        <p className={styles.subtitle}>
          Discover pure, farm-fresh products crafted with tradition and care.
        </p>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <div className={styles.card} key={cat.id}>
              <div className={styles.imageWrapper}>
                <img src={cat.image} alt={cat.title} />
                <div className={styles.overlay}></div>
                <h3 className={styles.cardTitle}>{cat.title}</h3>
              </div>

              <div className={styles.content}>
                <p>{cat.description}</p>
                {/* <button className={styles.button}>
                  {cat.buttonText}
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurCategories;