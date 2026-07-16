import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./HeroSection.css";

const slides = [
  { image: "/Images/home/farmer.jpg" },
  { image: "/Images/aboutUs/farm.jpg" },
  { image: "/Images/aboutUs/about-1.webp" },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="hero-carousel"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="hero-slide">
            <img src={slide.image} alt="" className="hero-slide-img" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hero-overlay">
        <div className="hero-gradient" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Premium Farm Fresh Products
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Maanjoo Farms Pilani
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            From Our Farm To Your Table – 100% Pure and Organic
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              className="hero-cta"
              onClick={() => navigate("/organic-products")}
            >
              Explore Products
              <ArrowRight size={18} />
            </button>
            <button
              className="hero-cta-secondary"
              onClick={() => navigate("/about")}
            >
              Our Story
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
