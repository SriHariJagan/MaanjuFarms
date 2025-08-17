import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // ✅ import Link
import { Sun, Moon, Search, ShoppingCart, AlignJustify, X } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const [theme, setTheme] = useState("light");
  const [cartCount] = useState(0);

  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Scroll hide/show + close menu
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, isMobileMenuOpen]);

  // Click outside to close menu
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
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Theme toggle
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (theme === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [theme]);

  return (
    <nav className={`navbar ${visible ? "" : "navbar-hidden"}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <span className="logo-text">MaanjuFarms</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          <Link to="/login" className="login-link">Log in</Link>

          <div className="search-wrapper">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Search..." />
          </div>

          <Link to="/cart" className="cart-button">
            <ShoppingCart size={18} />
            <span className="cart-count">{cartCount}</span>
          </Link>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <AlignJustify size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-nav-link">Home</Link>
            <Link to="/products" className="mobile-nav-link">Products</Link>
            <Link to="/about" className="mobile-nav-link">About Us</Link>
            <Link to="/blog" className="mobile-nav-link">Blog</Link>

            <div className="mobile-actions">
              <Link to="/login" className="mobile-login-link">Log in</Link>
              <Link to="/cart" className="mobile-get-started-button">
                Cart Products <ShoppingCart size={16} />
                <span className="cart-count">{cartCount}</span>
              </Link>
              <div className="mobile-search-wrapper">
                <input type="text" placeholder="Search..." />
                <Search size={14} className="search-icon" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
