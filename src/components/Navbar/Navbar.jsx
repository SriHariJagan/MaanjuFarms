import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, Search, ShoppingCart, AlignJustify, X } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
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

      // Close menu when scrolling
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
        !event.target.closest(".mobile-menu-button") // ignore button click
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

  // Apply theme to body when it changes
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
        {/* Logo */}
        <div className="navbar-logo">
          <a href="/" className="logo-link">
            <span className="logo-text">MaanjuFarms</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          <a href="/" className="mobile-nav-link">
              Home
          </a>
          <a href="/products" className="nav-link">
            Products
          </a>
          <a href="/about" className="nav-link">
            About Us
          </a>
          {/* <a href="/explore" className="nav-link">
            Explore
          </a> */}
          <a href="/contact" className="nav-link">
            Contact Us
          </a>
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          <a href="/login" className="login-link">
            Log in
          </a>

          {/* Search bar */}
          <div className="search-wrapper">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Search..." />
          </div>

          {/* Cart */}
          <a href="/cart" className="cart-button">
            <ShoppingCart size={18} />
            <span className="cart-count">{cartCount}</span>
          </a>

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu Button */}
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
        <div
          ref={mobileMenuRef}
          className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
        >
          <div className="mobile-menu-content">
            <a href="/" className="mobile-nav-link">
              Home
            </a>
            <a href="/products" className="mobile-nav-link">
              Products
            </a>
            <a href="/about" className="mobile-nav-link">
              About Us
            </a>
            {/* <a href="/explore" className="mobile-nav-link">
              Explore
            </a> */}
            <a href="/blog" className="mobile-nav-link">
              Blog
            </a>
            <div className="mobile-actions">
              <a href="/login" className="mobile-login-link">
                Log in
              </a>
              <a href="/cart" className="mobile-get-started-button">
                Cart Products <ShoppingCart size={16} />
                <span className="cart-count">{cartCount}</span>
              </a>
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
