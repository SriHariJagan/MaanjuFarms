import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../Store/useContext";
import {
  Package,
  ShoppingCart,
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  Sprout,
  Users,
  MapPin,
  Image,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total Orders", value: "156", icon: ShoppingCart, change: "+12%", color: "#609966" },
  { label: "Products", value: "48", icon: Package, change: "+4", color: "#9DC08B" },
  { label: "Bookings", value: "23", icon: CalendarCheck, change: "+8%", color: "#40513B" },
  { label: "Revenue", value: "₹1.2L", icon: IndianRupee, change: "+23%", color: "#c2823e" },
];

const quickActions = [
  { label: "Add Product", path: "/dashboard/products", icon: Sprout },
  { label: "View Orders", path: "/dashboard/orders", icon: ShoppingCart },
  { label: "Manage Gallery", path: "/dashboard/gallery", icon: Image },
  // { label: "Pincode Services", path: "/dashboard/pincode", icon: MapPin },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <motion.div
      className="dashboard-home"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="dash-welcome" variants={itemAnim}>
        <div>
          <h1 className="dash-greeting">
            Welcome back, {user?.name || "Admin"}
          </h1>
          <p className="dash-subtitle">Here&apos;s what&apos;s happening at Maanjoo Farms today.</p>
        </div>
        <motion.div
          className="dash-date-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <TrendingUp size={16} />
          <span>All systems active</span>
        </motion.div>
      </motion.div>

      <motion.div className="dash-stats-grid" variants={itemAnim}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="dash-stat-card"
            whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(64, 81, 59, 0.12)" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="stat-card-top">
              <span className="stat-icon-wrap" style={{ background: `${stat.color}18`, color: stat.color }}>
                <stat.icon size={20} />
              </span>
              <span className="stat-change positive">{stat.change}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="dash-quick-actions" variants={itemAnim}>
        <h2 className="dash-section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              variants={itemAnim}
              custom={i}
            >
              <Link to={action.path} className="quick-action-card">
                <span className="qa-icon">
                  <action.icon size={20} />
                </span>
                <span className="qa-label">{action.label}</span>
                <ArrowRight size={16} className="qa-arrow" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
