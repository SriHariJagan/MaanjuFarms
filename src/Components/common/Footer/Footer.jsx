import React from "react";
import styles from "./Footer.module.css";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* About */}
        <div className={`${styles.column} ${styles.aboutFooter}`}>
          <img src="/Images_/logo.png" alt="logo" width={105}/>
          <h3>Maanjoo Farms</h3>
          <p>
            A destination where <strong>nature</strong>, <strong>culture</strong>, and 
            <strong> adventure</strong> meet. From horse riding to camel safaris, 
            organic farming to agro-tourism, Maanjoo Farm is your gateway 
            to authentic Rajasthan.
          </p>
        </div>

        {/* Quick Links */}
        <div className={`${styles.column} ${styles.quickLinksFooter}`}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link  to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/organic-products">Organic Products</Link></li>
            <li><Link to="/horse-riding">Horse Riding</Link></li>
            <li><Link to="/camel-riding">Camel Safari</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Experiences */}
        <div className={`${styles.column} ${styles.ourExperiencesFooter}`}>
          <h4>Our Experiences</h4>
          <ul>
            <li>🐎Horse Riding Trails</li>
            <li>🐪Camel Safari</li>
            <li>🌾Organic Farming</li>
            <li>🏕 &nbsp;Agro-Tourism</li>
            <li>🔥Cultural Evenings</li>
          </ul>
        </div>

        {/* Contact */}
        <div className={`${styles.column} ${styles.contactFooter}`}>
          <h4>Contact Us</h4>
          <div className="styles.contactDetails">
            <p><MapPin size={16}/> &nbsp; Pilani, Rajasthan, India</p>
            <p><Phone size={16}/> &nbsp; +91 98765 43210</p>
            <p><Mail size={16}/>  &nbsp; info@maanjooFarms.com</p>
          </div>

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
