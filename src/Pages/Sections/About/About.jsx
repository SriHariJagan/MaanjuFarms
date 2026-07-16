import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./about.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Leaf, Award, Users, Sprout, ArrowRight } from "lucide-react";

const CountUp = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);
  const num = parseInt(value, 10);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = Math.max(1, Math.floor(num / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, duration / (num / step));
    return () => clearInterval(timer);
  }, [inView, num]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const fadeUp = {
  initial: { opacity: 1, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const staggerContainer = {
  initial: { opacity: 1 },
  whileInView: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
  viewport: { once: true, amount: 0.1 },
};

const staggerItem = {
  initial: { opacity: 1, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const produceItems = [
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
];

const experienceItems = [
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
];

const sustainableItems = [
  "Zero-chemical organic farming",
  "Rainwater harvesting & drip irrigation",
  "Solar-powered farm operations",
  "Waste recycling & composting",
];

const stats = [
  { icon: Sprout, value: "20+", num: "20", suffix: "+", label: "Acres of Farm" },
  { icon: Leaf, value: "2016", num: "2016", suffix: "", label: "Established" },
  { icon: Award, value: "100%", num: "100", suffix: "%", label: "Organic" },
  { icon: Users, value: "50+", num: "50", suffix: "+", label: "Bee Hives" },
];

const AboutUs = () => {
  return (
    <div className={styles.page}>
      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroGrain} />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className={styles.heroBadge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Leaf size={12} />
            Since 2016
          </motion.span>
          <h1 className={styles.heroTitle}>
            {"Maanjoo Farms".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className={styles.heroTagline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Where Tradition, Nature & Innovation Come Together
          </motion.p>
        </motion.div>
      </section>

      <div className={styles.inner}>
        {/* ===== OUR STORY ===== */}
        <section id="our-story" className={styles.introSection} style={{ scrollMarginTop: 80 }}>
          <motion.div className={styles.introContent} {...fadeUp}>
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
          </motion.div>
          <motion.div
            className={styles.carouselBlock}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              effect="fade"
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className={styles.carousel}
            >
              {["about-1.webp", "about-2.webp", "about-3.webp"].map((img, i) => (
                <SwiperSlide key={i}>
                  <div
                    className={styles.carouselImage}
                    style={{ backgroundImage: `url(/Images/aboutUs/${img})` }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </section>

        {/* ===== STATS ===== */}
        <motion.section
          className={styles.statsGrid}
          variants={staggerContainer}
          {...staggerContainer}
        >
          {stats.map((stat, i) => (
            <motion.div key={i} className={styles.statCard} variants={staggerItem}>
              <div className={styles.statIcon}>
                <stat.icon size={24} />
              </div>
              <span className={styles.statValue}>
                <CountUp value={stat.num} suffix={stat.suffix} />
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
          ))}
        </motion.section>

        {/* ===== WHAT WE GROW & BUILD ===== */}
        <motion.section
          id="what-we-grow"
          className={styles.section}
          style={{ scrollMarginTop: 80 }}
          {...fadeUp}
        >
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Our Produce</span>
            <h2>What We Grow & Build</h2>
            <p className={styles.sectionSub}>
              Combining agriculture with innovation and sustainability
            </p>
          </div>
          <motion.div
            className={styles.grid}
            variants={staggerContainer}
            {...staggerContainer}
          >
            {produceItems.map((item, i) => (
              <motion.div className={styles.card} key={i} variants={staggerItem}>
                <div className={styles.cardImage}>
                  <img
                    src={`/Images/aboutUs/${item.img}`}
                    alt={item.title}
                    loading="lazy"
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ===== ANIMAL & FARM EXPERIENCES ===== */}
        <motion.section
          id="animal-experiences"
          className={styles.section}
          style={{ scrollMarginTop: 80 }}
          {...fadeUp}
        >
          <div className={styles.sectionHeader}>
            <h2>Animal & Farm Experiences</h2>
          </div>
          <motion.div
            className={styles.grid}
            variants={staggerContainer}
            {...staggerContainer}
          >
            {experienceItems.map((item, i) => (
              <motion.div className={styles.card} key={i} variants={staggerItem}>
                <div className={styles.cardImage}>
                  <img
                    src={`/Images/aboutUs/${item.img}`}
                    alt={item.title}
                    loading="lazy"
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ===== SUSTAINABLE PRACTICES ===== */}
        <motion.section
          id="sustainable-practices"
          className={styles.sustainabilitySection}
          style={{ scrollMarginTop: 80 }}
          {...fadeUp}
        >
          <div className={styles.sectionHeader}>
            <h2>Sustainable Practices</h2>
          </div>
          <div className={styles.sustainGrid}>
            {sustainableItems.map((item, i) => (
              <motion.div
                key={i}
                className={styles.sustainItem}
                initial={{ opacity: 1, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className={styles.sustainDot} />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ===== OUR VISION ===== */}
        <motion.section
          id="our-vision"
          className={styles.visionSection}
          style={{ scrollMarginTop: 80 }}
          {...fadeUp}
        >
          <h2>Our Vision</h2>
          <p>
            We aim to redefine agriculture by making it{" "}
            <strong>profitable, sustainable, and respected</strong>, inspiring
            future generations to embrace farming as a modern career.
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutUs;
