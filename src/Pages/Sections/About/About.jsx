import React from "react";
import { motion } from "framer-motion";
import styles from "./about.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Leaf, Award, Users, Sprout } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
  viewport: { once: true, margin: "-40px" },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const highlights = [
  { title: "Fruits & Crops", desc: "Dates, Olives, Kinnow, Ber and other high-value crops.", img: "crops.jpg" },
  { title: "Beekeeping", desc: "50+ hives producing natural organic honey.", img: "beekeeping.avif" },
  { title: "Kadaknath Poultry", desc: "Protein-rich eggs & premium meat production.", img: "poultry.avif" },
  { title: "Agro-Forestry", desc: "Sandalwood, date palms and native trees.", img: "agroforestry.avif" },
];

const livestock = [
  { title: "Horse Riding", desc: "Guided rides on Marwari horses.", img: "horse-riding.avif" },
  { title: "Camel Safari", desc: "Traditional rides across rural trails.", img: "camel-safari.avif" },
  { title: "Dairy Farming", desc: "Organic milk from indigenous breeds.", img: "dairy-farming.avif" },
];

const stats = [
  { icon: <Sprout size={24} />, value: "20+", label: "Acres of Farm" },
  { icon: <Leaf size={24} />, value: "2016", label: "Established" },
  { icon: <Award size={24} />, value: "100%", label: "Organic" },
  { icon: <Users size={24} />, value: "50+", label: "Bee Hives" },
];

const AboutUs = () => {
  return (
    <div className={styles.aboutPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.heroBadge}>Since 2016</span>
          <h1 className={styles.heroTitle}>Maanjoo Farms</h1>
          <p className={styles.heroTagline}>
            Where Tradition, Nature & Innovation Come Together
          </p>
        </motion.div>
      </section>

      <div className={styles.innerContainer}>
        <motion.section className={styles.introSection} {...fadeUp}>
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
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className={styles.carousel}
            >
              {["about-1.webp", "about-2.webp", "about-3.webp"].map((img, i) => (
                <SwiperSlide key={i}>
                  <img src={`/Images/aboutUs/${img}`} alt="Farm View" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.section>

        <motion.section className={styles.statsSection} variants={staggerContainer} {...staggerContainer}>
          {stats.map((stat, i) => (
            <motion.div key={i} className={styles.statCard} variants={staggerItem}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </motion.section>

        <motion.section className={styles.highlightSection} {...fadeUp}>
          <div className={styles.sectionHeader}>
            <h2>What We Grow & Build</h2>
            <p>Combining agriculture with innovation and sustainability</p>
          </div>
          <motion.div className={styles.grid} variants={staggerContainer} {...staggerContainer}>
            {highlights.map((item, i) => (
              <motion.div className={styles.card} key={i} variants={staggerItem}>
                <div className={styles.cardImage}>
                  <img src={`/Images/aboutUs/${item.img}`} alt={item.title} loading="lazy" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className={styles.facilitySection} {...fadeUp}>
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
        </motion.section>

        <motion.section className={styles.livestockSection} {...fadeUp}>
          <div className={styles.sectionHeader}>
            <h2>Animal & Farm Experiences</h2>
          </div>
          <motion.div className={styles.grid} variants={staggerContainer} {...staggerContainer}>
            {livestock.map((item, i) => (
              <motion.div className={styles.card} key={i} variants={staggerItem}>
                <div className={styles.cardImage}>
                  <img src={`/Images/aboutUs/${item.img}`} alt={item.title} loading="lazy" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className={styles.sustainabilitySection} {...fadeUp}>
          <div className={styles.sectionHeader}>
            <h2>Sustainable Practices</h2>
          </div>
          <div className={styles.sustainGrid}>
            {["Zero-chemical organic farming", "Rainwater harvesting & drip irrigation", "Solar-powered farm operations", "Waste recycling & composting"].map((item, i) => (
              <div key={i} className={styles.sustainItem}>
                <div className={styles.sustainDot} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className={styles.teamSection} {...fadeUp}>
          <h2>Our Vision</h2>
          <p>
            We aim to redefine agriculture by making it{" "}
            <strong>profitable, sustainable, and respected</strong>, inspiring
            future generations to embrace farming as a modern career.
          </p>
        </motion.section>

        <motion.section className={styles.partnersSection} {...fadeUp}>
          <h2>Trusted By</h2>
          <p>
            Proud suppliers to <strong>Taj, Hyatt, Radisson</strong> and leading
            retail buyers across Delhi-NCR.
          </p>
        </motion.section>

        <motion.section className={styles.factsSection} {...fadeUp}>
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
        </motion.section>
      </div>
    </div>
  );
};

export default AboutUs;
