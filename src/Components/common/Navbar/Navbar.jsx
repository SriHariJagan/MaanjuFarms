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

const offeringsDropdown = [
  { path: "/organic-products", label: "Organic Products" },
  { path: "/horse-riding", label: "Horse Riding" },
  { path: "/camel-riding", label: "Camel Riding" },
  { path: "/villas", label: "Villas & Stays" },
];

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === "admin";

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);
  const [visible, setVisible] = useState(true);
  const mobileRef = useRef(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.pageYOffset;
      setIsScrolled(current > 20);
      setVisible(prevScroll > current || current < 20);
      setPrevScroll(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScroll]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  const closeMenu = () => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? "scrolled" : ""} ${visible ? "" : "hidden"}`}
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
              Home
              <div className="nav-indicator" />
            </Link>

            <div
              className="nav-link dropdown-trigger"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span className="dropdown-label">
                Offerings <ChevronDown size={14} className="chevron" />
              </span>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="dropdown-menu"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {offeringsDropdown.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="dropdown-item"
                      >
                        {item.label}
                      </Link>
                    ))}
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
                {item.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <Link to="/cart" className="cart-btn">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <motion.span
                  className="cart-badge"
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {cartCount}
                </motion.span>
              )}
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
              className="mobile-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            ref={mobileRef}
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-menu-content">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0 }}
              >
                <Link to="/" className="mobile-link" onClick={closeMenu}>
                  Home
                </Link>
              </motion.div>

              <div className="mobile-section-label">Offerings</div>

              {offeringsDropdown.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i + 1) * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className="mobile-link mobile-link-sub"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mobile-divider" />

              {navItems.slice(1).map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (offeringsDropdown.length + 1 + i) * 0.05 }}
                >
                  <Link to={item.path} className="mobile-link" onClick={closeMenu}>
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {user && !isAdmin && (
                <Link to="/my-orders" className="mobile-link" onClick={closeMenu}>
                  My Orders
                </Link>
              )}
              {user && isAdmin && (
                <>
                  <Link to="/admin/orders" className="mobile-link" onClick={closeMenu}>
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

              <div className="mobile-divider" />

              <div className="mobile-actions">
                <Link to="/cart" className="mobile-action-btn" onClick={closeMenu}>
                  <ShoppingCart size={16} />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>

                {user ? (
                  <button
                    className="mobile-action-btn"
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
                    className="mobile-action-btn"
                    onClick={closeMenu}
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
