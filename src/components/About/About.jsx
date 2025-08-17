import React from "react";
import styles from "./about.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const About = () => {
  // 🖼️ Put all images in an array
  const carouselImages = [
    { src: "/images/about-1.webp", alt: "Manjoo Farms Field" },
    { src: "/images/about-2.webp", alt: "Organic Farming" },
    { src: "/images/about-3.webp", alt: "Farm Team" },
  ];

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>About Manjoo Farms</h1>
      </section>

      {/* Intro Section */}
      <section className={styles.introSection}>
        <div className={styles.textBlock}>
          <h2>Discover Manjoo Farms</h2>
          <p>
            Founded by ex-NSG commando Mukesh Manjoo after his father's illness
            led him to return to his agricultural roots, Manjoo Farms in Pilani,
            Rajasthan is a thriving model of organic and integrated farming.
          </p>
          <span>
            ✨ Manjoo Farms – nurturing health, tradition, and innovation in
            harmony with nature.
          </span>
        </div>

        {/* 🌟 Swiper Carousel with array mapping */}
        <div className={styles.carouselContainer}>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className={styles.carousel}
        >
          {carouselImages.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img.src} alt={img.alt} />
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </section>

      {/* Highlights Section */}
      <section className={styles.highlightSection}>
        <div className={styles.card}>
          <img src="/images/organic-crops.webp" alt="Crops" />
          <h3>Organic Harvests</h3>
          <p>
            Cultivating olives, dates, kinnow, mosambi, Thai apple ber, Sangri,
            and sandalwood across 20 acres, using organic manure from cow dung,
            urine, and buttermilk.
          </p>
        </div>
        <div className={styles.card}>
          <img src="/images/integrated-farming.webp" alt="Integrated Farming" />
          <h3>Integrated Farming</h3>
          <p>
            Combining crop production with fish farming, Kadaknath poultry,
            beekeeping (50 hives), Sahiwal cows, camels, and horses—for a
            sustainable, diverse ecosystem.
          </p>
        </div>
      </section>

      {/* Revenue Section */}
      <section className={styles.facilitySection}>
        <img src="/images/facilityImg.jpg" alt="Farm Facility" />
        <div className={styles.textBlock}>
          <h2>Profitable Organic Venture</h2>
          <p>
            With rainwater harvesting, drip irrigation, and no mandi sales,
            Mukesh supplies directly to Delhi-NCR, hotels, and loyal
            customers—earning around ₹6 lakh per acre from dates alone.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className={styles.teamSection}>
        <div className={styles.textBlock}>
          <h2>Vision & Mission</h2>
          <p>
            Mukesh aims to change perceptions—proving sustainable farming can be
            profitable, eco-conscious, and socially impactful. His mission:
            empower farmers through innovation, authenticity, and integrity.
          </p>
        </div>
      </section>

      {/* Quick Facts */}
      <section className={styles.factsSection}>
        <h2 className={styles.tableTitle}>Quick Facts</h2>
        <div className={styles.tableContainer}>
          <table className={styles.factsTable}>
            <tbody>
              <tr>
                <th>Founder</th>
                <td>Mukesh Manjoo (ex-NSG Commando, Delhi Airport)</td>
              </tr>
              <tr>
                <th>Location</th>
                <td>Pilani, Rajasthan</td>
              </tr>
              <tr>
                <th>Established</th>
                <td>
                  Cultivation began in 2014; “Manjoo Farms” name from 2016
                  onwards
                </td>
              </tr>
              <tr>
                <th>Land Under Cultivation</th>
                <td>Approx. 20 acres</td>
              </tr>
              <tr>
                <th>Main Crops</th>
                <td>
                  Olives, Dates, Kinnow, Mosambi, Thai Apple Ber, Sangri,
                  Sandalwood
                </td>
              </tr>
              <tr>
                <th>Revenue Source</th>
                <td>
                  Direct sales to hotels (e.g., Taj, Hyatt), retail customers;
                  date farming ~₹6L per acre
                </td>
              </tr>
              <tr>
                <th>Farming Practices</th>
                <td>
                  Organic manure, drip irrigation, rainwater harvesting,
                  integrated livestock & apiary
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default About;
