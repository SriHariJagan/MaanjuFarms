import { useState, useEffect } from "react";
import "./Contactus.css";
import { CONTACT_API } from "../../../urls";

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // success | error
  const [errors, setErrors] = useState({});

  // ✅ Auto hide message after 5 sec
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // ✅ Validation
  const validate = (data) => {
    const newErrors = {};

    // Name
    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      newErrors.email = "Enter a valid email";
    }

    // Indian Phone (10 digit, starts with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
      newErrors.phone = "Enter valid 10-digit Indian number";
    }

    // Subject
    if (!data.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    // Message
    if (data.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

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

    // ✅ Validate before API
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
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="contact-container">
      {/* Hero */}
      <div className="contact-hero-section">
        <img src="/Images/contactUsBanner.jpg" alt="Contact" />
        <div className="contact-hero-overlay">
          <h1>Get in Touch</h1>
          <p>We’d love to hear from you 🌿</p>
        </div>
      </div>

      {/* Form */}
      <div className="message-section">
        <h2>Send Us a Message</h2>
        <p>We usually respond within 24 hours</p>

        <form onSubmit={handleSubmit} className="contact-form">
          
          {/* Row 1 */}
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

          {/* Row 2 */}
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

          {/* Message */}
          <div className="form-row full">
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
              ></textarea>
              {errors.message && <span className="error-text">{errors.message}</span>}
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className={`submit-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {/* Status Messages */}
          {status === "success" && (
            <p className="success-msg">✅ Message sent successfully!</p>
          )}

          {status === "error" && (
            <p className="error-msg">
              ❌ Failed to send message. Try again.
            </p>
          )}
        </form>
      </div>

      {/* Contact Info */}
      <div className="connect-section">
        <h2>Visit or Contact Us</h2>

        <div className="connect-cards">
          <div className="info-card">
            <h4>Address</h4>
            <p>Pilani, Rajasthan</p>

            <h4>Phone</h4>
            <p>+91 XXXXX XXXXX</p>

            <h4>Email</h4>
            <p>info@maanjufarms.com</p>
          </div>

          <div className="map-card">
            <iframe
              src="https://www.google.com/maps?q=Pilani,Rajasthan&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              title="Map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;