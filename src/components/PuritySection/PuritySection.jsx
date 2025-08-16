import React from 'react';
import './PuritySection.css';

const PuritySection = () => {
  return (
    <section className="purity-section">
      <div className="container">
        <div className="purity-content">
          <div className="purity-text">
            <h2 className="purity-title">Our Commitment to Purity</h2>
            <h3 className="purity-subtitle">From Our Farms, Directly to Your Table</h3>
            <p className="purity-description">
              At Pure Harvest Organics, we believe in providing food that is not just healthy but also ethically sourced and sustainably produced. We partner directly with local farmers who share our passion for organic farming, ensuring every product is grown without harmful chemicals or pesticides. Our journey from seed to your plate is transparent, guaranteeing authenticity and a taste that only nature can provide.
            </p>
          </div>
          <div className="purity-image">
            <img src="/images/farmer.jpeg" alt="Farmers working in organic fields" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PuritySection;