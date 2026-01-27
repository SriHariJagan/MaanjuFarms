import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import Loader from "./components/Loader/Loader.jsx";

/* Lazy-loaded components */
const HeroSection = lazy(() => import("./components/HeroSection/HeroSection.jsx"));
const ProductCategories = lazy(() =>
  import("./components/ProductCategories/ProductCategories.jsx")
);
const Bestsellers = lazy(() =>
  import("./components/Bestsellers/Bestsellers.jsx")
);
const PuritySection = lazy(() =>
  import("./components/PuritySection/PuritySection.jsx")
);
const Testimonials = lazy(() =>
  import("./components/Testimonials/Testimonials.jsx")
);

const ContactUs = lazy(() => import("./components/ContactUs/ContactUs.jsx"));
const Cart = lazy(() => import("./components/Cart/Cart.jsx"));
const About = lazy(() => import("./components/About/About.jsx"));
const ProductsPage = lazy(() =>
  import("./components/ProductsPage/ProductsPage.jsx")
);
const ProductDetails = lazy(() =>
  import("./components/ProductDetails/ProductDetails.jsx")
);
const Gallery = lazy(() => import("./components/Gallery/Gallery.jsx"));
const HorseRiding = lazy(() =>
  import("./components/HorseRiding/HorseRiding.jsx")
);
const CamelRiding = lazy(() =>
  import("./components/CamelRiding/CamelRiding.jsx")
);
const VillasStays = lazy(() =>
  import("./components/VillasStays/VillasStays.jsx")
);
const Login = lazy(() => import("./components/Login/Login.jsx"));
const Signup = lazy(() => import("./components/Signup/Signup.jsx"));

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={2000} />
      <Navbar />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Home */}
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

          {/* Public Routes */}
          <Route path="/organic-products" element={<ProductsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/horse-riding" element={<HorseRiding />} />
          <Route path="/camel-riding" element={<CamelRiding />} />
          <Route path="/villas" element={<VillasStays />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Route */}
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />

          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <Footer />
    </Router>
  );
}

export default App;
