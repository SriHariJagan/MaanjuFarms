import "./ContactUs.css";

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <div className="contact-hero-section">
        <img
          src="/images/contactus.jpg"
          alt="Contact Us"
          className="hero-image"
        />
        <div className="contact-hero-overlay">
          <h1>Get in Touch with PureHarvest Organics</h1>
          <p>We’re here to answer any questions or inquiries you may have.</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="message-section">
        <h2>Send Us a Message</h2>
        <p>
          Fill out the form below and we'll get back to you as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <input type="text" placeholder="Subject" required />
          <textarea placeholder="Your Message" rows="6" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>

      {/* Connect Section */}
      <div className="connect-section">
        <h2>Visit Us or Connect Directly</h2>
        <div className="connect-cards">
          <div className="info-card">
            <h4>Our Address</h4>
            <p>123 Organic Lane, Green Valley, Harvestland, HV 54321</p>
            <h4>Phone Number</h4>
            <p>+1 (555) 123-PURE (7873)</p>
            <h4>Email Address</h4>
            <p>info@pureharvestorganics.com</p>
          </div>
          <div className="map-card">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.34203530906!2d78.24323239564612!3d17.412281015627997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1755345520643!5m2!1sen!2sin"
              width="100%"
              height="350"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Location"
            ></iframe>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What makes PureHarvest Organics products unique?</summary>
          <p>Our products are 100% organic and sustainably sourced.</p>
        </details>
        <details>
          <summary>Where can I purchase your products?</summary>
          <p>Visit our online store or select retail partners.</p>
        </details>
        <details>
          <summary>Do you offer international shipping?</summary>
          <p>Yes, we ship worldwide with tracking available.</p>
        </details>
        <details>
          <summary>Are your products gluten-free and vegan?</summary>
          <p>Yes, all our products are gluten-free and vegan-friendly.</p>
        </details>
      </div>
    </div>
  );
};

export default ContactUs;
