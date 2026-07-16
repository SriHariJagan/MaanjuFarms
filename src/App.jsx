import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PrivateRoute from "./Components/PrivateRoute.jsx";
import ProtectedAdminRoute from "./Components/ProtectedAdminRoute.jsx";
import Loader from "./Components/Loader.jsx";
import HomeLayout from "./Components/layout/HomeLayout.jsx";

import Home from "./Pages/Home/Home.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import Checkout from "./Pages/Checkout/Checkout.jsx";
import GuestDetails from "./Pages/GuestDetails/GuestDetails.jsx";
import PincodeManagement from "./Pages/PincodeManagement/PincodeManagement.jsx";
/* Admin pages */
const AdminLayout = lazy(() => import("./Pages/Admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("./Pages/Admin/AdminDashboard.jsx"));
const AdminProducts = lazy(() => import("./Pages/Admin/AdminProducts.jsx"));
const AdminVillas = lazy(() => import("./Pages/Admin/AdminVillas.jsx"));
const AdminGallery = lazy(() => import("./Pages/Admin/AdminGallery.jsx"));
const AdminOrdersNew = lazy(() => import("./Pages/Admin/AdminOrders.jsx"));
const AdminCustomers = lazy(() => import("./Pages/Admin/AdminCustomers.jsx"));
const AdminMessages = lazy(() => import("./Pages/Admin/AdminMessages.jsx"));
const AdminAnalytics = lazy(() => import("./Pages/Admin/AdminAnalytics.jsx"));
const AdminSettings = lazy(() => import("./Pages/Admin/AdminSettings.jsx"));
/* Lazy-loaded components */
const ProductsPage = lazy(
  () => import("./Pages/Offerings/ProductsPage/ProductsPage.jsx"),
);
const HorseRiding = lazy(
  () => import("./Pages/Offerings/HorseRiding/HorseRiding.jsx"),
);
const CamelRiding = lazy(
  () => import("./Pages/Offerings/CamelRiding/CamelRiding.jsx"),
);
const VillasStays = lazy(
  () => import("./Pages/Offerings/VillasStays/VillasStays.jsx"),
);
/*Sections*/
const AboutUs = lazy(() => import("./Pages/Sections/About/About.jsx"));
const ContactUs = lazy(
  () => import("./Pages/Sections/ContactUs/ContactUs.jsx"),
);
const Gallery = lazy(() => import("./Pages/Sections/Gallery/Gallery.jsx"));
/*Products and cart pages*/
const ProductDetails = lazy(
  () => import("./Components/ProductDetails/ProductDetails.jsx"),
);

const Cart = lazy(() => import("./Pages/Sections/Cart/Cart.jsx"));
const AdminOrder = lazy(
  () => import("./Pages/Orders/AdminOrders/AdminOrders .jsx"),
);
const UserOrders = lazy(
  () => import("./Pages/Orders/UserOrders/UserOrders.jsx"),
);

/*Auth pages*/
const Login = lazy(() => import("./Pages/Auth/Login/Login.jsx"));
const Signup = lazy(() => import("./Pages/Auth/Signup/Signup.jsx"));
/* Payment pages*/
const PaymentFailure = lazy(() => import("./Pages/Payment/PaymentFailure.jsx"));
const PaymentSuccess = lazy(() => import("./Pages/Payment/PaymentSuccess.jsx"));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={2000} />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Layout Wrapper */}
          <Route path="/" element={<HomeLayout />}>
            {/* Home */}
            <Route index element={<Home />} />

            {/* Public Routes */}
            <Route path="organic-products" element={<ProductsPage />} />
            <Route path="horse-riding" element={<HorseRiding />} />
            <Route path="camel-riding" element={<CamelRiding />} />
            <Route path="villas" element={<VillasStays />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="product/:id" element={<ProductDetails />} />

            {/* Protected */}
            <Route
              path="cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />

            <Route
              path="/my-orders"
              element={
                <PrivateRoute>
                  <UserOrders />
                </PrivateRoute>
              }
            />

            <Route
              path="checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />

            <Route path="/guest-details" element={<GuestDetails />} />
          </Route>

          {/* Admin routes (outside HomeLayout — admin shell with sidebar/topbar) */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="villas" element={<AdminVillas />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="orders" element={<AdminOrdersNew />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="pincode-management" element={<PincodeManagement />} />
          </Route>

          {/* Routes WITHOUT layout (no navbar/footer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailure />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
