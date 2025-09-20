import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react"; // for icons
import styles from "./Gallery.module.css";

const galleryItems = [
  { src: "/images/farm.jpg", title: "Organic Farming" },
  { src: "/images/agro-tourism.jpg", title: "Agro-Tourism" },
  { src: "/images/camel-riding.jpg", title: "Camel Riding" },
  { src: "/images/horse-riding.jpg", title: "Horse Riding" },
  { src: "/images/cottages.jpg", title: "Farm Cottages" },
  { src: "/images/food.jpg", title: "Organic Meals" },
  { src: "/images/culture.jpg", title: "Local Culture" },
  { src: "/images/workshop.jpg", title: "Workshops & Learning" },
  { src: "/images/festival.jpg", title: "Festivals & Events" },
];

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(null);

  const openLightbox = (index) => setCurrentIndex(index);
  const closeLightbox = () => setCurrentIndex(null);

  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? galleryItems.length - 1 : prev - 1
    );
  };

  const showNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === galleryItems.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.title}>Our Gallery</h2>
      <p className={styles.subtitle}>
        Discover the beauty of Maanjoo Farming – from nature and animals to
        cultural experiences and peaceful stays.
      </p>

      {/* Image Grid */}
      <div className={styles.grid}>
        {galleryItems.map((item, index) => (
          <div
            className={styles.card}
            key={index}
            onClick={() => openLightbox(index)}
          >
            <img src={item.src} alt={item.title} className={styles.image} />
            <div className={styles.overlay}>
              <span>{item.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {currentIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.closeBtn} onClick={closeLightbox}>
            <X size={28} />
          </button>
          <button className={styles.prevBtn} onClick={showPrev}>
            <ChevronLeft size={40} />
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryItems[currentIndex].src}
              alt={galleryItems[currentIndex].title}
              className={styles.lightboxImage}
            />
            <p className={styles.lightboxTitle}>
              {galleryItems[currentIndex].title}
            </p>
          </div>
          <button className={styles.nextBtn} onClick={showNext}>
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;
