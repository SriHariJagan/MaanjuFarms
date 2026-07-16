import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, LayoutDashboard } from "lucide-react";

const DashboardSection = ({ title }) => {
  const location = useLocation();
  const iconMap = {
    Orders: "📦",
    Products: "🌱",
    Booking: "📅",
    Rooms: "🚪",
    Customers: "👥",
    Gallery: "🖼️",
    "PinCode Services": "📍",
    Analytics: "📊",
    Settings: "⚙️",
  };

  const emoji = iconMap[title] || "📄";

  return (
    <motion.div
      className="dash-section-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="section-breadcrumb">
        <Link to="/dashboard" className="breadcrumb-link">
          <LayoutDashboard size={14} />
          Dashboard
        </Link>
        <ChevronRight size={14} className="breadcrumb-sep" />
        <span className="breadcrumb-current">{title}</span>
      </div>

      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <span className="section-emoji">{emoji}</span>
        <h1 className="section-title">{title}</h1>
      </motion.div>

      <motion.div
        className="section-card"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className="section-card-icon">
          <LayoutDashboard size={32} />
        </div>
        <p className="section-card-text">
          {title} section is under development
        </p>
        <p className="section-card-sub">
          This feature will be available soon
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DashboardSection;
