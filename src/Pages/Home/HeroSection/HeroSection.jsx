import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./HeroSection.css";

const Hero = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const videos = ["/videos/video1.mp4"];

  return (
    <section ref={sectionRef} className="hero">
      <motion.div className="hero-video-wrapper" style={{ scale: videoScale }}>
        <video
          ref={videoRef}
          src={videos[0]}
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
        />
      </motion.div>

      <motion.div className="hero-overlay" style={{ opacity: overlayOpacity }}>
        <div className="hero-gradient" />
        <motion.div className="hero-content" style={{ y: contentY }}>
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
      </motion.div>
    </section>
  );
};

export default Hero;
