import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import "./Contactus.css";
import { CONTACT_API } from "../../../urls";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const validate = (data) => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = "Name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) newErrors.email = "Enter a valid email";
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data.phone)) newErrors.phone = "Enter valid 10-digit Indian number";
    if (!data.subject.trim()) newErrors.subject = "Subject is required";
    if (data.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);
      setStatus(null);

      const res = await fetch(CONTACT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-overlay" />
        <motion.div
          className="contact-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you</p>
        </motion.div>
      </section>

      <div className="contact-container">
        <div className="contact-grid">
          <motion.div className="contact-form-section" {...fadeUp}>
            <h2>Send Us a Message</h2>
            <p className="contact-form-subtitle">We usually respond within 24 hours</p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <input name="name" type="text" placeholder="Your Name" />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <input name="email" type="email" placeholder="Your Email" />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input name="phone" type="text" placeholder="Contact Number" />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <input name="subject" type="text" placeholder="Subject" />
                  {errors.subject && <span className="error-text">{errors.subject}</span>}
                </div>
              </div>

              <div className="form-group">
                <textarea name="message" placeholder="Your Message" rows="5" />
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>

              <button type="submit" className={`submit-btn ${loading ? "loading" : ""}`} disabled={loading}>
                <Send size={16} />
                {loading ? "Sending..." : "Send Message"}
              </button>

              {status === "success" && <p className="success-msg">Message sent successfully!</p>}
              {status === "error" && <p className="error-msg">Failed to send message. Try again.</p>}
            </form>
          </motion.div>

          <motion.div className="contact-info-section" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
            <div className="info-card">
              <div className="info-icon">
                <MapPin size={20} />
              </div>
              <h4>Address</h4>
              <p>Pilani, Rajasthan</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Phone size={20} />
              </div>
              <h4>Phone</h4>
              <p>+91 98765 43210</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Mail size={20} />
              </div>
              <h4>Email</h4>
              <p>info@maanjufarms.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Clock size={20} />
              </div>
              <h4>Response Time</h4>
              <p>Within 24 hours</p>
            </div>

            <div className="map-card">
              <iframe
                src="https://www.google.com/maps?q=Pilani,Rajasthan&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                title="Map"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
