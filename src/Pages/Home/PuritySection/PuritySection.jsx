import React from "react";
import { motion } from "framer-motion";
import { Leaf, Shield, Sprout, Heart } from "lucide-react";
import "./PuritySection.css";

const values = [
  {
    icon: Leaf,
    title: "100% Organic",
    desc: "Grown without harmful chemicals or pesticides",
  },
  {
    icon: Shield,
    title: "Ethically Sourced",
    desc: "Directly from local farmers who share our values",
  },
  {
    icon: Sprout,
    title: "Sustainably Farmed",
    desc: "Regenerative practices that nurture the earth",
  },
  {
    icon: Heart,
    title: "Farm-to-Table",
    desc: "From our fields to your kitchen, pure & fresh",
  },
];

const PuritySection = () => {
  return (
    <section className="purity-section">
      <div className="container">
        <div className="purity-grid">
          <motion.div
            className="purity-content"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="purity-label">
              <Leaf size={14} />
              Our Commitment
            </span>
            <h2 className="purity-title">
              From Our Farms, Directly to Your Table
            </h2>
            <p className="purity-description">
              At Pure Harvest Organics, we believe in providing food that is not
              just healthy but also ethically sourced and sustainably produced.
              We partner directly with local farmers who share our passion for
              organic farming, ensuring every product is grown without harmful
              chemicals or pesticides. Our journey from seed to your plate is
              transparent, guaranteeing authenticity and a taste that only nature
              can provide.
            </p>

            <div className="purity-values">
              {values.map((val, i) => (
                <motion.div
                  key={val.title}
                  className="purity-value-item"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                >
                  <span className="purity-value-icon">
                    <val.icon size={16} />
                  </span>
                  <div>
                    <strong>{val.title}</strong>
                    <p>{val.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="purity-image-wrapper"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <div className="purity-image">
              <img
                src="/Images/home/farmer.jpg"
                alt="Farmers working in organic fields"
              />
              <div className="purity-image-border" />
            </div>
            <div className="purity-accent-circle" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PuritySection;
