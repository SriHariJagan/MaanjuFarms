import React from "react";
import styles from "./Footer.module.css";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* About */}
        <div className={styles.column}>
          <h3>Maanjoo Farms</h3>
          <p>
            A destination where <strong>nature</strong>, <strong>culture</strong>, and 
            <strong> adventure</strong> meet. From horse riding to camel safaris, 
            organic farming to agro-tourism, Maanjoo Farm is your gateway 
            to authentic Rajasthan.
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.column}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/farming">Farming</a></li>
            <li><a href="/horseriding">Horse Riding</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Experiences */}
        <div className={styles.column}>
          <h4>Our Experiences</h4>
          <ul>
            <li>🐎 Horse Riding Trails</li>
            <li>🐪 Camel Safari</li>
            <li>🌾 Organic Farming</li>
            <li>🏕 Agro-Tourism</li>
            <li>🔥 Cultural Evenings</li>
          </ul>
        </div>

        {/* Contact */}
        <div className={styles.column}>
          <h4>Contact Us</h4>
          <p><MapPin size={16}/> Pilani, Rajasthan, India</p>
          <p><Phone size={16}/> +91 98765 43210</p>
          <p><Mail size={16}/> info@maanjooFarms.com</p>

          <div className={styles.social}>
            <a href="#"><Facebook /></a>
            <a href="#"><Instagram /></a>
            <a href="#"><Youtube /></a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <p>© {new Date().getFullYear()} Maanjoo Farms · All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
