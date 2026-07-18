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
import Loader from "./Components/Loader.jsx";
import HomeLayout from "./Components/layout/HomeLayout.jsx";
import DashboardLayout from "./Components/layout/DashboardLayout.jsx";

import Home from "./Pages/Home/Home.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import Checkout from "./Pages/Checkout/Checkout.jsx";
import GuestDetails from "./Pages/GuestDetails/GuestDetails.jsx";
import PincodeManagement from "./Pages/PincodeManagement/PincodeManagement.jsx";
import { useAuth } from "./Store/useContext.jsx";
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
/*Policies*/
const PolicyPage = lazy(() => import("./Pages/Legal/PolicyPage.jsx"));
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
const UserOrders = lazy(
  () => import("./Pages/Orders/UserOrders/UserOrders.jsx"),
);

/*Auth pages*/
const Login = lazy(() => import("./Pages/Auth/Login/Login.jsx"));
const Signup = lazy(() => import("./Pages/Auth/Signup/Signup.jsx"));
const ForgotPassword = lazy(() => import("./Pages/Auth/ForgotPassword/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./Pages/Auth/ResetPassword/ResetPassword.jsx"));
/* Payment pages*/
const PaymentFailure = lazy(() => import("./Pages/Payment/PaymentFailure.jsx"));
const PaymentSuccess = lazy(() => import("./Pages/Payment/PaymentSuccess.jsx"));
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard/AdminDashboard.jsx"));
const DashboardSection = lazy(() => import("./Pages/AdminDashboard/DashboardSection.jsx"));
const OrdersPage = lazy(() => import("./Pages/AdminDashboard/OrdersPage/OrdersPage.jsx"));
const AdminProductsPage = lazy(() => import("./Pages/AdminDashboard/ProductsPage/ProductsPage.jsx"));
// const CustomersPage = lazy(() => import("./Pages/AdminDashboard/CustomersPage/CustomersPage.jsx"));
const AdminGalleryPage = lazy(() => import("./Pages/AdminDashboard/GalleryPage/GalleryPage.jsx"));
const AdminBookingsPage = lazy(() => import("./Pages/AdminDashboard/BookingsPage/BookingsPage.jsx"));
const AdminRoomsPage = lazy(() => import("./Pages/AdminDashboard/RoomsPage/RoomsPage.jsx"));
const AdminPincodePage = lazy(() => import("./Pages/AdminDashboard/PincodePage/PincodePage.jsx"));
const AdminPolicyPage = lazy(() => import("./Pages/AdminDashboard/PolicyPage/PolicyPage.jsx"));
// const AdminAnalyticsPage = lazy(() => import("./Pages/AdminDashboard/AnalyticsPage/AnalyticsPage.jsx"));
// const AdminSettingsPage = lazy(() => import("./Pages/AdminDashboard/SettingsPage/SettingsPage.jsx"));

function App() {
  const { isAdmin } = useAuth(); // Get isAdmin from AuthContext
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

            {/* Legal / Policy Routes */}
            <Route path="terms-and-conditions" element={<PolicyPage />} />
            <Route path="privacy-policy" element={<PolicyPage />} />
            <Route path="return-refund-policy" element={<PolicyPage />} />
            <Route path="shipping-delivery-policy" element={<PolicyPage />} />
            <Route path="payment-policy" element={<PolicyPage />} />
            <Route path="villa-booking-cancellation-policy" element={<PolicyPage />} />
            <Route path="grievance-redressal" element={<PolicyPage />} />

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

            <Route
              path="admin/pincode-management"
              element={
                <PrivateRoute>
                  {isAdmin ? (
                    <PincodeManagement />
                  ) : (
                    <Navigate to="/" replace />
                  )}
                </PrivateRoute>
              }
            />

            <Route path="/guest-details" element={<GuestDetails />} />
          </Route>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route
              index
              element={
                isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="rooms" element={<AdminRoomsPage />} />
            {/* <Route path="customers" element={<CustomersPage />} /> */}
            <Route path="gallery" element={<AdminGalleryPage />} />
            <Route path="pincode" element={<AdminPincodePage />} />
            <Route path="policies" element={<AdminPolicyPage />} />
            {/* <Route path="analytics" element={<AdminAnalyticsPage />} /> */}
            {/* <Route path="settings" element={<AdminSettingsPage />} */}
          </Route>

          {/* Routes WITHOUT layout (no navbar/footer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
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
