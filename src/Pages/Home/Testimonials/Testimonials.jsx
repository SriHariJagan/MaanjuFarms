import React from "react";
import { motion } from "framer-motion";
import { testimonialsData } from "../../../data";
import { Quote, Star } from "lucide-react";
import "./Testimonials.css";

const Testimonials = () => {
  const doubledData = [...testimonialsData, ...testimonialsData];

  return (
    <section className="testimonials-section">
      <div className="container">
        <motion.div
          className="testimonials-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="testimonials-title">What Our Customers Say</h2>
          <p className="testimonials-subtitle">
            Real stories from people who love our farm-fresh products
          </p>
        </motion.div>

        {/* Single Row Marquee */}
        <div className="testimonials-marquee-container">
          <motion.div
            className="testimonials-track"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              repeat: Infinity,
              duration: 40,
              ease: "linear",
            }}
            whileHover={{ paused: true }}
          >
            {doubledData.map((testimonial, index) => (
              <div className="testimonial-card" key={`${testimonial.id}-${index}`}>
                <Quote size={20} className="quote-icon" />
                <div className="testimonial-rating">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < testimonial.rating ? "star-filled" : "star-empty"}
                      fill={i < testimonial.rating ? "#f0bf6d" : "none"}
                    />
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.testimonial}</p>
                <div className="testimonial-author-wrapper">
                  <div className="testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="testimonial-author">{testimonial.name}</h4>
                    <span className="testimonial-verified">Verified Customer</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
