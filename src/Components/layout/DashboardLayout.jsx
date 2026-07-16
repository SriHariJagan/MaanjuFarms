import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ArrowLeft, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../../Store/useContext";
import DashboardSidebar from "./DashboardSidebar";
import Footer from "../common/Footer/Footer";
import "../common/Navbar/Navbar.css";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsProfileOpen(false);
  }, [location]);

  const pageTransition = {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="dashboard-page">
      <motion.nav
        className={`dashboard-navbar ${isScrolled ? "scrolled" : ""}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="dashboard-nav-container">
          <div className="dashboard-nav-left">
            <Link to="/" className="dashboard-logo-link">
              <motion.span
                className="dash-logo-icon-wrap"
                whileHover={{ rotate: -15 }}
                transition={{ duration: 0.3 }}
              >
                <Leaf size={22} />
              </motion.span>
              <span className="dashboard-logo-text">Maanjoo Farms</span>
            </Link>

            <span className="dash-nav-divider" />

            <span className="dashboard-heading">
              <LayoutDashboard size={18} />
              Dashboard
            </span>
          </div>

          <div className="dashboard-nav-right">
            <motion.button
              className="dashboard-back-btn"
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </motion.button>

            <div className="dash-nav-sep" />

            {user && (
              <div className="profile-wrapper" ref={profileRef}>
                <motion.button
                  className="profile-avatar dash-profile-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  title="Profile"
                >
                  {isAdmin ? "A" : "U"}
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      className="profile-dropdown"
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="dash-dropdown-header">
                        <span className="dash-dropdown-name">{user?.name || "Admin"}</span>
                        <span className="dash-dropdown-role">{isAdmin ? "Admin" : "User"}</span>
                      </div>
                      <div className="dash-dropdown-divider" />
                      <button
                        className="profile-dropdown-item"
                        onClick={() => { logout(); }}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <div className="dashboard-body" style={{ paddingTop: "60px" }}>
        <DashboardSidebar />

        <main className="dashboard-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
