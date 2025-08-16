import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import HeroSection from "./components/HeroSection/HeroSection.jsx";
import ProductCategories from "./components/ProductCategories/ProductCategories.jsx";
import Bestsellers from "./components/Bestsellers/Bestsellers.jsx";
import PuritySection from "./components/PuritySection/PuritySection.jsx";
import Testimonials from "./components/Testimonials/Testimonials.jsx";
import ContactUs from "./components/ContactUs/ContactUs.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <ProductCategories />
              <Bestsellers />
              <PuritySection />
              <Testimonials />
            </>
          }
        />

        {/* Contact route */}
        <Route path="/contact" element={<ContactUs />} />

        {/* Catch-all route → redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
