import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./Footer.module.css";
import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Leaf,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { POLICY_API } from "../../../urls";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const POLICY_SLUGS = [
  { slug: "terms-and-conditions", label: "Terms & Conditions" },
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "return-refund-policy", label: "Return & Refund Policy" },
  { slug: "shipping-delivery-policy", label: "Shipping & Delivery" },
  { slug: "payment-policy", label: "Payment Policy" },
  { slug: "villa-booking-cancellation-policy", label: "Booking Cancellation" },
  { slug: "grievance-redressal", label: "Grievance Redressal" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const Footer = () => {
  const [publishedSlugs, setPublishedSlugs] = useState([]);

  useEffect(() => {
    axios
      .get(POLICY_API.ALL)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          const slugs = res.data.data.map((p) => p.slug);
          setPublishedSlugs(slugs);
        }
      })
      .catch(() => {});
  }, []);

  const publishedPolicies = POLICY_SLUGS.filter((p) =>
    publishedSlugs.includes(p.slug)
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.waveDivider}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 60 480 20 720 30C960 40 1200 10 1440 25V60H0V40Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className={styles.container}>
        <motion.div className={styles.column} {...fadeUp}>
          <div className={styles.brand}>
            <Leaf size={22} className={styles.brandIcon} />
            <h3>Maanjoo Farms</h3>
          </div>
          <p className={styles.description}>
            A destination where <strong>nature</strong>, <strong>culture</strong>
            , and <strong>adventure</strong> meet. From horse riding to camel
            safaris, organic farming to agro-tourism, Maanjoo Farm is your
            gateway to authentic Rajasthan.
          </p>
          <Link to="/about" className={styles.learnMore}>
            Learn more about us
            <ArrowUpRight size={14} />
          </Link>
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

        {publishedPolicies.length > 0 && (
          <motion.div
            className={styles.column}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
          >
            <h4>Legal &amp; Policies</h4>
            <ul>
              {publishedPolicies.map((p) => (
                <li key={p.slug}>
                  <Link to={`/${p.slug}`}>{p.label}</Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.div
          className={styles.column}
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.3 }}
        >
          <h4>Contact Us</h4>
          <div className={styles.contactDetails}>
            <p>
              <MapPin size={14} />
              Pilani, Rajasthan, India
            </p>
            <p>
              <Phone size={14} />
              +91 98765 43210
            </p>
            <p>
              <Mail size={14} />
              info@maanjooFarms.com
            </p>
          </div>

          <div className={styles.social}>
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                className={styles.socialLink}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title={social.label}
                aria-label={social.label}
              >
                <social.icon size={18} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className={styles.bottomBar}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className={styles.bottomInner}>
          <p>© {new Date().getFullYear()} Maanjoo Farms · All Rights Reserved</p>
          <div className={styles.bottomLinks}>
            <Link to="/contact">Contact</Link>
            <Link to="/about">About</Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
