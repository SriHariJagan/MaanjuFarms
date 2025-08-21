import React from "react";
import styles from "./about.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const AboutUs = () => {
  return (
    <div className={styles.aboutPage}>
      {/* 🌟 Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>About Maanjoo Farms</h1>
        <p>Where Tradition Meets Innovation</p>
      </section>

      {/* 🌱 Introduction with Carousel */}
      <section className={styles.introSection}>
        <div className={styles.textBlock}>
          <h2>Our Story</h2>
          <p>
            Maanjoo Farms is a pioneering organic and integrated farm located in{" "}
            <strong>Pilani, Rajasthan</strong>. Founded by{" "}
            <strong>Mukesh Manjoo</strong>, a former NSG commando, the farm is
            an inspiring model of how agriculture can be both profitable and
            sustainable. Since its establishment in 2016, Maanjoo Farms has
            grown into a hub for organic farming, agri-tourism, and rural
            innovation.
          </p>
        </div>

        <div className={styles.carouselContainer}>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className={styles.carousel}
          >
            <SwiperSlide>
              <img src="/images/about-1.webp" alt="Farm Landscape" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/about-2.webp" alt="Organic Farming" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/about-3.webp" alt="Agri Tourism" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/about-1.webp" alt="Camel & Horse Riding" />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* 🚜 Farming Highlights */}
      <section className={styles.highlightSection}>
        <div className={styles.card}>
          <img src="/images/farm.jpg" alt="Dates Farming" />
          <h3>Dates & Fruits</h3>
          <p>High-value crops like Dates, Olives, Kinnow, and Ber.</p>
        </div>

        <div className={styles.card}>
          <img src="/images/farm.jpg" alt="Beekeeping" />
          <h3>Beekeeping</h3>
          <p>50+ hives producing natural organic honey.</p>
        </div>

        <div className={styles.card}>
          <img src="/images/farm.jpg" alt="Kadaknath Poultry" />
          <h3>Kadaknath Poultry</h3>
          <p>Famous for protein-rich eggs & premium meat.</p>
        </div>

        <div className={styles.card}>
          <img src="/images/farm.jpg" alt="Sandalwood Plantation" />
          <h3>Agro-Forestry</h3>
          <p>Includes Sandalwood, Date Palms, and native desert trees.</p>
        </div>
      </section>

      {/* 🐎 Agro Tourism Facility */}
      <section className={styles.facilitySection}>
        <img src="/images/farm.jpg" alt="Farm Tourism" />
        <div className={styles.textBlock}>
          <h2>Agro-Tourism & Experiences</h2>
          <p>
            Visitors can stay at beautiful farm villas, enjoy horse & camel
            rides, farm walks, and traditional Rajasthani food with cultural
            evenings. 
            <br />
            Special activities include: tractor rides, organic food
            workshops, folk music nights, and bird watching.
          </p>
        </div>
      </section>

      {/* 🐪 Livestock & Riding */}
      <section className={styles.livestockSection}>
        <h2>Livestock & Animal Experiences</h2>
        <div className={styles.cardsRow}>
          <div className={styles.card}>
            <img src="/images/farm.jpg" alt="Horse Riding" />
            <h3>Horse Riding</h3>
            <p>
              Explore the farm on Marwari horses with guided riding sessions.
            </p>
          </div>
          <div className={styles.card}>
            <img src="/images/farm.jpg" alt="Camel Safari" />
            <h3>Camel Rides</h3>
            <p>
              Traditional camel safaris across the farm & nearby desert trails.
            </p>
          </div>
          <div className={styles.card}>
            <img src="/images/farm.jpg" alt="Dairy Farming" />
            <h3>Dairy Farming</h3>
            <p>
              Indigenous cow breeds providing organic milk and dairy products.
            </p>
          </div>
        </div>
      </section>

      {/* 🌍 Sustainability */}
      <section className={styles.sustainabilitySection}>
        <h2>Our Sustainable Practices</h2>
        <ul>
          <li>Zero-chemical organic farming methods.</li>
          <li>Rainwater harvesting & drip irrigation.</li>
          <li>Solar-powered farm operations.</li>
          <li>Waste recycling and composting systems.</li>
        </ul>
      </section>

      {/* 👨‍🌾 Team / Vision */}
      <section className={styles.teamSection}>
        <h2>Our Vision</h2>
        <p>
          At Maanjoo Farms, our vision is to prove that{" "}
          <strong>farming can be profitable</strong> while protecting the
          environment and promoting sustainable living. We strive to inspire the
          next generation to see agriculture as a rewarding and respected career
          path.
        </p>
      </section>

      {/* 🤝 Partnerships */}
      <section className={styles.partnersSection}>
        <h2>Our Partners</h2>
        <p>
          Maanjoo Farms proudly supplies organic produce to{" "}
          <strong>Taj, Hyatt, Radisson</strong>, and leading retail buyers in
          Delhi-NCR. We also collaborate with agricultural universities for
          research and training.
        </p>
      </section>

      {/* 📊 Quick Facts */}
      <section className={styles.factsSection}>
        <h2 className={styles.tableTitle}>Quick Facts</h2>
        <div className={styles.tableContainer}>
          <table className={styles.factsTable}>
            <tbody>
              <tr>
                <th>Founder</th>
                <td>Mukesh Manjoo (Ex-NSG Commando)</td>
              </tr>
              <tr>
                <th>Location</th>
                <td>Pilani, Rajasthan</td>
              </tr>
              <tr>
                <th>Started</th>
                <td>2016</td>
              </tr>
              <tr>
                <th>Land Area</th>
                <td>20+ acres</td>
              </tr>
              <tr>
                <th>Main Crops</th>
                <td>
                  Dates, Olives, Kinnow, Mosambi, Thai Apple Ber, Sandalwood
                </td>
              </tr>
              <tr>
                <th>Livestock</th>
                <td>Horses, Camels, Kadaknath Poultry, Indigenous Cows</td>
              </tr>
              <tr>
                <th>Tourism</th>
                <td>Villas, Horse Riding, Camel Riding, Farm Walks</td>
              </tr>
              <tr>
                <th>Clients</th>
                <td>Taj, Hyatt, Radisson, Delhi-NCR retail buyers</td>
              </tr>
              <tr>
                <th>Practices</th>
                <td>Organic Farming, Agroforestry, Solar Energy, Beekeeping</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
