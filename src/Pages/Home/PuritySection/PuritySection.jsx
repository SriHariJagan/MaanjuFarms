import React from 'react';
import { motion } from 'framer-motion';
import './PuritySection.css';

const PuritySection = () => {
  return (
    <section className="purity-section">
      <div className="container">
        <motion.div
          className="purity-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="purity-text">
            <span className="purity-label">Our Commitment</span>
            <h2 className="purity-title">From Our Farms, Directly to Your Table</h2>
            <p className="purity-description">
              At Pure Harvest Organics, we believe in providing food that is not just healthy but also ethically sourced and sustainably produced. We partner directly with local farmers who share our passion for organic farming, ensuring every product is grown without harmful chemicals or pesticides. Our journey from seed to your plate is transparent, guaranteeing authenticity and a taste that only nature can provide.
            </p>
          </div>
          <div className="purity-image-wrapper">
            <div className="purity-image">
              <img src="/Images/home/farmer.jpg" alt="Farmers working in organic fields" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PuritySection;
