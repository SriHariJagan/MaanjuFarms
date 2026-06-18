import React from "react";
import { motion } from "framer-motion";
import styles from "./Footer.module.css";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.topBorder} />

      <div className={styles.container}>
        <motion.div className={styles.column} {...fadeUp}>
          <div className={styles.brand}>
            <Leaf size={22} className={styles.brandIcon} />
            <h3>Maanjoo Farms</h3>
          </div>
          <p className={styles.description}>
            A destination where <strong>nature</strong>, <strong>culture</strong>, and
            <strong> adventure</strong> meet. From horse riding to camel safaris,
            organic farming to agro-tourism, Maanjoo Farm is your gateway
            to authentic Rajasthan.
          </p>
        </motion.div>

        <motion.div
          className={styles.column}
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
        >
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/organic-products">Organic Products</Link></li>
            <li><Link to="/horse-riding">Horse Riding</Link></li>
            <li><Link to="/camel-riding">Camel Safari</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </motion.div>

        <motion.div
          className={styles.column}
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
        >
          <h4>Our Experiences</h4>
          <ul className={styles.experiences}>
            <li>Horse Riding Trails</li>
            <li>Camel Safari</li>
            <li>Organic Farming</li>
            <li>Agro-Tourism</li>
            <li>Cultural Evenings</li>
          </ul>
        </motion.div>

        <motion.div
          className={styles.column}
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.3 }}
        >
          <h4>Contact Us</h4>
          <div className={styles.contactDetails}>
            <p><MapPin size={14} /> Pilani, Rajasthan, India</p>
            <p><Phone size={14} /> +91 98765 43210</p>
            <p><Mail size={14} /> info@maanjooFarms.com</p>
          </div>

          <div className={styles.social}>
            <a href="#" className={styles.socialLink}><Facebook size={18} /></a>
            <a href="#" className={styles.socialLink}><Instagram size={18} /></a>
            <a href="#" className={styles.socialLink}><Youtube size={18} /></a>
          </div>
        </motion.div>
      </div>

      <div className={styles.bottomBar}>
        <p>© {new Date().getFullYear()} Maanjoo Farms · All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
