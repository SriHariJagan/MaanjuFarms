// Navbar.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import {
  Sun,
  Moon,
  ShoppingCart,
  AlignJustify,
  X,
  ChevronDown,
  LogIn,
  LogOut,
  Package,
  ClipboardList,
} from "lucide-react";

import "./Navbar.css";

import { useCart, useAuth } from "../../../Store/useContext";

const Navbar = () => {
  //
  // CART
  //

  const { cart } = useCart();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  //
  // AUTH
  //

  const { user, logout } = useAuth();

  //
  // ✅ ADMIN CHECK
  //

  const isAdmin = user?.role === "admin";

  //
  // STATES
  //

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);

  const [visible, setVisible] = useState(true);

  const [theme, setTheme] = useState("light");

  //
  // REFS
  //

  const mobileMenuRef = useRef(null);

  //
  // TOGGLE MOBILE MENU
  //

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  //
  // CLOSE MENU AFTER LINK CLICK
  //

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  //
  // NAVBAR HIDE / SHOW
  //

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  //
  // CLOSE MOBILE MENU OUTSIDE CLICK
  //

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  //
  // THEME TOGGLE
  //

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <nav className={`navbar ${visible ? "" : "navbar-hidden"}`}>
      <div className="navbar-container">
        {/* LOGO */}

        <div className="navbar-logo">
          <Link to="/" className="logo-link" onClick={handleLinkClick}>
            <img
              src="/Images/logo.png"
              alt="Maanjoo Farms Logo"
              className="logo-image"
              width={20}
            />

            <span className="logo-text">Maanjoo Farms</span>
          </Link>
        </div>

        {/* DESKTOP MENU */}

        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>

          {/* OFFERINGS */}

          <div
            className="nav-link dropdown"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            Offerings <ChevronDown size={14} />
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/organic-products" className="dropdown-item">
                  Organic Products
                </Link>

                <Link to="/horse-riding" className="dropdown-item">
                  Horse Riding
                </Link>

                <Link to="/camel-riding" className="dropdown-item">
                  Camel Riding
                </Link>

                <Link to="/villas" className="dropdown-item">
                  Villas & Stays
                </Link>
              </div>
            )}
          </div>

          <Link to="/gallery" className="nav-link">
            Gallery
          </Link>

          <Link to="/about" className="nav-link">
            About Us
          </Link>

          <Link to="/contact" className="nav-link">
            Contact Us
          </Link>

          {/* ✅ USER ORDERS */}

          {user && !isAdmin && (
            <Link to="/my-orders" className="nav-link">
              My Orders
            </Link>
          )}

          {/* ✅ ADMIN ORDERS */}

          {user && isAdmin && (
            <Link to="/admin/orders" className="nav-link">
              Orders
            </Link>
          )}

          {user && isAdmin && (
            <Link to="/admin/pincode-management" className="nav-link">
              Pincode Management
            </Link>
          )}
        </div>

        {/* RIGHT ACTIONS */}

        <div className="navbar-actions">
          {/* CART */}

          <Link to="/cart" className="cart-button">
            <ShoppingCart size={18} />

            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          {/* THEME */}

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* LOGIN / LOGOUT */}

          {user ? (
            <button className="auth-button" onClick={logout}>
              <LogOut size={16} />
            </button>
          ) : (
            <Link to="/login" className="auth-button">
              <LogIn size={16} />
            </Link>
          )}

          {/* MOBILE MENU BUTTON */}

          <button
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <AlignJustify size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}

      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
        >
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-nav-link" onClick={handleLinkClick}>
              Home
            </Link>

            <Link
              to="/organic-products"
              className="mobile-nav-link"
              onClick={handleLinkClick}
            >
              Organic Products
            </Link>

            <Link
              to="/horse-riding"
              className="mobile-nav-link"
              onClick={handleLinkClick}
            >
              Horse Riding
            </Link>

            <Link
              to="/camel-riding"
              className="mobile-nav-link"
              onClick={handleLinkClick}
            >
              Camel Riding
            </Link>

            <Link
              to="/villas"
              className="mobile-nav-link"
              onClick={handleLinkClick}
            >
              Villas & Stays
            </Link>

            <Link
              to="/gallery"
              className="mobile-nav-link"
              onClick={handleLinkClick}
            >
              Gallery
            </Link>

            <Link
              to="/about"
              className="mobile-nav-link"
              onClick={handleLinkClick}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className="mobile-nav-link"
              onClick={handleLinkClick}
            >
              Contact Us
            </Link>

            {/* ✅ USER ORDERS */}

            {user && !isAdmin && (
              <Link
                to="/my-orders"
                className="mobile-nav-link"
                onClick={handleLinkClick}
              >
                My Orders
              </Link>
            )}

            {user && !isAdmin && (
              <Link
                to="/pincode-management"
                className="mobile-nav-link"
                onClick={handleLinkClick}
              >
                Pincode Management
              </Link>
            )}

            {/* ✅ ADMIN ORDERS */}

            {user && isAdmin && (
              <Link
                to="/admin/orders"
                className="mobile-nav-link"
                onClick={handleLinkClick}
              >
                Orders
              </Link>
            )}

            {/* CART */}

            <Link
              to="/cart"
              className="mobile-get-started-button"
              onClick={handleLinkClick}
            >
              <ShoppingCart size={16} />

              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            {/* LOGIN / LOGOUT */}

            {user ? (
              <button
                className="mobile-auth-button"
                onClick={() => {
                  logout();
                  handleLinkClick();
                }}
              >
                Logout <LogOut size={16} />
              </button>
            ) : (
              <Link
                to="/login"
                className="mobile-auth-button"
                onClick={handleLinkClick}
              >
                Login <LogIn size={16} />
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
