import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/cart" element={<Cart />} />

        {/* Catch-all route → redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
