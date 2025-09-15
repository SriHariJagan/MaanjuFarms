import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  Moon,
  Search,
  ShoppingCart,
  AlignJustify,
  X,
  ChevronDown,
} from "lucide-react";
import "./Navbar.css";
import { useCart } from "../../Store/useContext";

const Navbar = () => {
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const [theme, setTheme] = useState("light");

  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Close menu after link click
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // Close mobile menu when clicking outside
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
          <Link to="/" className="logo-link" onClick={handleLinkClick}>
            <span className="logo-text">🌿 Maanjoo Farms</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
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
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Search (hidden on mobile) */}
          <div className="search-wrapper desktop-only">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Search..." />
          </div>

          {/* Cart */}
          <Link to="/cart" className="cart-button">
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          {/* Theme Toggle */}
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
            <Link to="/" className="mobile-nav-link" onClick={handleLinkClick}>
              Home
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

             <button className="mobile-dropdown" onClick={toggleDropdown}>
              Offerings <ChevronDown size={14} />
            </button>
            {isDropdownOpen && (
              <div className="mobile-dropdown-menu">
                <Link
                  to="/organic-products"
                  className="mobile-dropdown-item"
                  onClick={handleLinkClick}
                >
                  Organic Products
                </Link>
                <Link
                  to="/horse-riding"
                  className="mobile-dropdown-item"
                  onClick={handleLinkClick}
                >
                  Horse Riding
                </Link>
                <Link
                  to="/camel-riding"
                  className="mobile-dropdown-item"
                  onClick={handleLinkClick}
                >
                  Camel Riding
                </Link>
                <Link
                  to="/villas"
                  className="mobile-dropdown-item"
                  onClick={handleLinkClick}
                >
                  Villas & Stays
                </Link>
              </div>
            )}


            {/* Mobile Search */}
            <div className="mobile-search-wrapper">
              <input type="text" placeholder="Search..." />
              <Search size={14} className="search-icon" />
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="mobile-get-started-button"
              onClick={handleLinkClick}
            >
              Cart <ShoppingCart size={16} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
