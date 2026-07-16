import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Leaf } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./HeroSection.css";

const slides = [
  { image: "/Images/home/farmer.jpg" },
  { image: "/Images/aboutUs/farm.jpg" },
  { image: "/Images/aboutUs/about-1.webp" },
];

const wordReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        className="hero-carousel"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="hero-slide">
            <div
              className="hero-slide-img"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Premium Gradient Overlay */}
      <div className="hero-overlay-gradient" />

      {/* Grain Texture Overlay */}
      <div className="hero-grain" />

      <div className="hero-overlay">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Leaf size={12} />
            Premium Farm Fresh Products
          </motion.div>

          {/* Heading - Word Reveal */}
          <h1 className="hero-heading">
            {"Maanjoo Farms Pilani".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="hero-word"
                custom={i}
                variants={wordReveal}
                initial="hidden"
                animate="visible"
                aria-hidden="true"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Tagline */}
          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            From Our Farm To Your Table – 100% Pure and Organic
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              className="hero-cta"
              onClick={() => navigate("/organic-products")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Explore Products</span>
              <ArrowRight size={18} />
            </motion.button>
            <motion.button
              className="hero-cta-secondary"
              onClick={() => navigate("/about")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Our Story
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
