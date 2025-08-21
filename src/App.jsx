import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar/Navbar.jsx";
import HeroSection from "./components/HeroSection/HeroSection.jsx";
import ProductCategories from "./components/ProductCategories/ProductCategories.jsx";
import Bestsellers from "./components/Bestsellers/Bestsellers.jsx";
import PuritySection from "./components/PuritySection/PuritySection.jsx";
import Testimonials from "./components/Testimonials/Testimonials.jsx";
import ContactUs from "./components/ContactUs/ContactUs.jsx";
import Cart from "./components/Cart/Cart.jsx";
import About from "./components/About/About.jsx";
import ProductsPage from "./components/ProductsPage/ProductsPage.jsx";
import ProductDetails from "./components/ProductDetails/ProductDetails.jsx";
import Gallery from "./components/Gallery/Gallery.jsx";
import HorseRiding from "./components/HorseRiding/HorseRiding.jsx";
import CamelRiding from "./components/CamelRiding/CamelRiding.jsx";
import Footer from "./components/Footer/Footer.jsx";
import VillasStays from "./components/VillasStays/VillasStays.jsx";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={2000} />
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
        <Route path="/organic-farming" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/horse-riding" element={<HorseRiding />} />
        <Route path="/camel-riding" element={<CamelRiding />} />
        <Route path="/villas" element={<VillasStays />} />

        {/* Catch-all route → redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
