import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  LogIn,
  LogOut,
  Leaf,
  Sprout,
  Trees,
  Tent,
  Warehouse,
  User,
  LayoutDashboard,
  ArrowLeftFromLine,
} from "lucide-react";
import "./Navbar.css";

import { useCart, useAuth } from "../../../Store/useContext";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/organic-products", label: "Products" },
  { path: "/gallery", label: "Gallery" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

const offeringsData = [
  {
    path: "/organic-products",
    label: "Organic Products",
    desc: "Pure ghee, honey, spices & grains",
    icon: Sprout,
  },
  {
    path: "/horse-riding",
    label: "Horse Riding",
    desc: "Explore trails on horseback",
    icon: Trees,
  },
  {
    path: "/camel-riding",
    label: "Camel Safari",
    desc: "Desert adventure experience",
    icon: Tent,
  },
  {
    path: "/villas",
    label: "Villas & Stays",
    desc: "Luxury farm stay retreats",
    icon: Warehouse,
  },
];

const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileRef = useRef(null);
  const timerRef = useRef(null);
  const profileRef = useRef(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setIsMobileOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const closeMenu = () => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? "scrolled" : ""}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <Leaf size={22} className="logo-icon" />
            <span className="logo-text">Maanjoo Farms</span>
          </Link>

          <div className="navbar-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              <span className="nav-label">Home</span>
              {location.pathname === "/" && (
                <motion.div
                  className="nav-indicator"
                  layoutId="navIndicator"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>

            <div
              className={`nav-link dropdown-trigger ${isDropdownOpen ? "dropdown-active" : ""}`}
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className="nav-label dropdown-label">
                Offerings
                <ChevronDown
                  size={14}
                  className={`chevron ${isDropdownOpen ? "chevron-open" : ""}`}
                />
              </span>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="mega-menu"
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="mega-menu-inner">
                      {offeringsData.map((item, i) => (
                        <motion.div
                          key={item.path}
                          custom={i}
                          variants={staggerItem}
                          initial="hidden"
                          animate="visible"
                        >
                          <Link
                            to={item.path}
                            className="mega-item"
                            onClick={closeMenu}
                          >
                            <span className="mega-icon">
                              <item.icon size={18} />
                            </span>
                            <span className="mega-text">
                              <span className="mega-label">{item.label}</span>
                              <span className="mega-desc">{item.desc}</span>
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navItems.slice(1).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
              >
                <span className="nav-label">{item.label}</span>
                {location.pathname === item.path && (
                  <motion.div
                    className="nav-indicator"
                    layoutId="navIndicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            {isAdmin && user && (
              <div className="admin-profile-wrapper" ref={profileRef}>
                <motion.button
                  className="admin-profile-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Admin dashboard"
                >
                  <div className="admin-profile-avatar">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} />
                    ) : (
                      <span>{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
                    )}
                  </div>
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      className="admin-profile-dropdown"
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="admin-profile-dropdown-header">
                        <div className="admin-profile-avatar-lg">
                          {user?.profileImage ? (
                            <img src={user.profileImage} alt={user.name} />
                          ) : (
                            <span>{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
                          )}
                        </div>
                        <div>
                          <p className="admin-profile-name">{user?.name || "Admin"}</p>
                          <p className="admin-profile-role">Administrator</p>
                        </div>
                      </div>
                      <div className="admin-profile-dropdown-menu">
                        <Link
                          to="/admin"
                          className="admin-profile-dropdown-item"
                          onClick={() => setProfileOpen(false)}
                        >
                          <LayoutDashboard size={15} />
                          <span>Dashboard</span>
                        </Link>
                        <button
                          className="admin-profile-dropdown-item"
                          onClick={() => {
                            setProfileOpen(false);
                            window.history.back();
                          }}
                        >
                          <ArrowLeftFromLine size={15} />
                          <span>Back to Website</span>
                        </button>
                        <div className="admin-profile-dropdown-divider" />
                        <button
                          className="admin-profile-dropdown-item admin-profile-dropdown-item--danger"
                          onClick={() => {
                            setProfileOpen(false);
                            logout();
                          }}
                        >
                          <LogOut size={15} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <Link to="/cart" className="cart-btn">
              <ShoppingCart size={18} />
              <AnimatePresence mode="wait">
                {cartCount > 0 && (
                  <motion.span
                    className="cart-badge"
                    key={cartCount}
                    initial={{ scale: 0, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: 10 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                    }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {user ? (
              <motion.button
                className="icon-btn"
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Logout"
              >
                <LogOut size={18} />
              </motion.button>
            ) : (
              <Link to="/login" className="icon-btn">
                <LogIn size={18} />
              </Link>
            )}

            <motion.button
              className={`mobile-toggle ${isMobileOpen ? "mobile-toggle-open" : ""}`}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <div className="hamburger-box">
                <span className={`hamburger-line top ${isMobileOpen ? "open" : ""}`} />
                <span className={`hamburger-line middle ${isMobileOpen ? "open" : ""}`} />
                <span className={`hamburger-line bottom ${isMobileOpen ? "open" : ""}`} />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full Screen Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={mobileRef}
              className="mobile-menu"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mobile-menu-header">
                <Leaf size={20} className="text-brand-400" />
                <span className="text-forest-800 font-heading font-bold text-lg">
                  Maanjoo Farms
                </span>
                <button
                  className="mobile-close-btn"
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mobile-menu-body">
                <motion.div
                  className="mobile-section"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/"
                    className="mobile-link primary"
                    onClick={closeMenu}
                  >
                    <Leaf size={16} />
                    Home
                  </Link>
                </motion.div>

                <motion.div
                  className="mobile-section"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="mobile-section-label">Offerings</div>
                  {offeringsData.map((item, i) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        className="mobile-link"
                        onClick={closeMenu}
                      >
                        <item.icon size={16} />
                        <span>
                          {item.label}
                          <span className="mobile-link-desc">{item.desc}</span>
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="mobile-divider"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                />

                <motion.div
                  className="mobile-section"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {navItems.slice(1).map((item, i) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        className="mobile-link"
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                {user && (
                  <>
                    <motion.div
                      className="mobile-divider"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.55, duration: 0.4 }}
                    />
                    <motion.div
                      className="mobile-section"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="mobile-section-label">Account</div>
                      {!isAdmin && (
                        <Link
                          to="/my-orders"
                          className="mobile-link"
                          onClick={closeMenu}
                        >
                          <User size={16} />
                          My Orders
                        </Link>
                      )}
                      {isAdmin && (
                        <>
                          <Link
                            to="/admin/orders"
                            className="mobile-link"
                            onClick={closeMenu}
                          >
                            Orders
                          </Link>
                          <Link
                            to="/admin/pincode-management"
                            className="mobile-link"
                            onClick={closeMenu}
                          >
                            Pincode Management
                          </Link>
                        </>
                      )}
                    </motion.div>
                  </>
                )}
              </div>

              <motion.div
                className="mobile-menu-footer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/cart"
                  className="mobile-footer-btn"
                  onClick={closeMenu}
                >
                  <ShoppingCart size={16} />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>

                {user ? (
                  <button
                    className="mobile-footer-btn logout"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="mobile-footer-btn"
                    onClick={closeMenu}
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
