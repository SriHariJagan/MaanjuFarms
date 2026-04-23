import React from "react";
import styles from "./about.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { img } from "framer-motion/client";

const AboutUs = () => {
  return (
    <div className={styles.aboutPage}>
      
      {/* ================= HERO ================= */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Maanjoo Farms</h1>
          <p className={styles.heroTagline}>
            Where Tradition, Nature & Innovation Come Together
          </p>
        </div>
      </section>

      {/* ================= INTRO ================= */}
      <section className={styles.introSection}>
        <div className={styles.textBlock}>
          <span className={styles.sectionLabel}>Our Story</span>
          <h2>Rooted in Purpose, Growing with Passion</h2>
          <p>
            Located in <strong>Pilani, Rajasthan</strong>, Maanjoo Farms is a
            progressive organic farm founded by{" "}
            <strong>Mukesh Manjoo</strong>, a former NSG commando. Since 2016,
            the farm has evolved into a thriving ecosystem combining{" "}
            <strong>organic farming, agro-tourism, and rural innovation</strong>.
          </p>
          <p>
            Our mission is simple — to prove that agriculture can be{" "}
            <strong>profitable, sustainable, and inspiring</strong>.
          </p>
        </div>

        <div className={styles.carouselContainer}>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className={styles.carousel}
          >
            {["about-1.webp", "about-2.webp", "about-3.webp"].map((img, i) => (
              <SwiperSlide key={i}>
                <img src={`/Images/aboutUs/${img}`} alt="Farm View" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ================= HIGHLIGHTS ================= */}
      <section className={styles.highlightSection}>
        <div className={styles.sectionHeader}>
          <h2>What We Grow & Build</h2>
          <p>Combining agriculture with innovation and sustainability</p>
        </div>

        <div className={styles.grid}>
          {[
            {
              title: "Fruits & Crops",
              desc: "Dates, Olives, Kinnow, Ber and other high-value crops.",
              img: "crops.jpg",
            },
            {
              title: "Beekeeping",
              desc: "50+ hives producing natural organic honey.",
              img: "beekeeping.avif",
            },
            {
              title: "Kadaknath Poultry",
              desc: "Protein-rich eggs & premium meat production.",
              img: "poultry.avif",
            },
            {
              title: "Agro-Forestry",
              desc: "Sandalwood, date palms and native trees.",
              img: "agroforestry.avif",
            },
          ].map((item, i) => (
            <div className={styles.card} key={i}>
              <img src={`/Images/aboutUs/${item.img}`} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= EXPERIENCE ================= */}
      <section className={styles.facilitySection}>
        <div className={styles.imageBlock}>
          <img src="/Images/aboutUs/farm.jpg" alt="Farm Experience" />
        </div>

        <div className={styles.textBlock}>
          <span className={styles.sectionLabel}>Experience</span>
          <h2>Agro Tourism & Farm Life</h2>
          <p>
            Stay in our serene farm villas and reconnect with nature through
            immersive experiences like horse riding, camel rides, tractor
            rides, and guided farm walks.
          </p>
          <p>
            Enjoy authentic Rajasthani cuisine, cultural evenings, and hands-on
            organic workshops.
          </p>
        </div>
      </section>

      {/* ================= LIVESTOCK ================= */}
      <section className={styles.livestockSection}>
        <div className={styles.sectionHeader}>
          <h2>Animal & Farm Experiences</h2>
        </div>

        <div className={styles.grid}>
          {[
            {
              title: "Horse Riding",
              desc: "Guided rides on Marwari horses.",
              img: "horse-riding.avif",
            },
            {
              title: "Camel Safari",
              desc: "Traditional rides across rural trails.",
              img: "camel-safari.avif",
            },
            {
              title: "Dairy Farming",
              desc: "Organic milk from indigenous breeds.",
              img: "dairy-farming.avif",
            },
          ].map((item, i) => (
            <div className={styles.card} key={i}>
              <img src={`/Images/aboutUs/${item.img}`} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SUSTAINABILITY ================= */}
      <section className={styles.sustainabilitySection}>
        <div className={styles.sectionHeader}>
          <h2>Sustainable Practices</h2>
        </div>

        <ul className={styles.list}>
          <li>Zero-chemical organic farming</li>
          <li>Rainwater harvesting & drip irrigation</li>
          <li>Solar-powered farm operations</li>
          <li>Waste recycling & composting</li>
        </ul>
      </section>

      {/* ================= VISION ================= */}
      <section className={styles.teamSection}>
        <h2>Our Vision</h2>
        <p>
          We aim to redefine agriculture by making it{" "}
          <strong>profitable, sustainable, and respected</strong>, inspiring
          future generations to embrace farming as a modern career.
        </p>
      </section>

      {/* ================= PARTNERS ================= */}
      <section className={styles.partnersSection}>
        <h2>Trusted By</h2>
        <p>
          Proud suppliers to <strong>Taj, Hyatt, Radisson</strong> and leading
          retail buyers across Delhi-NCR.
        </p>
      </section>

      {/* ================= FACTS ================= */}
      <section className={styles.factsSection}>
        <h2 className={styles.tableTitle}>Quick Facts</h2>

        <div className={styles.tableContainer}>
          <table className={styles.factsTable}>
            <tbody>
              <tr><th>Founder</th><td>Mukesh Manjoo</td></tr>
              <tr><th>Location</th><td>Pilani, Rajasthan</td></tr>
              <tr><th>Established</th><td>2016</td></tr>
              <tr><th>Land Area</th><td>20+ Acres</td></tr>
              <tr><th>Livestock</th><td>Horses, Camels, Poultry, Cows</td></tr>
              <tr><th>Activities</th><td>Farm Stay, Riding, Tours</td></tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;