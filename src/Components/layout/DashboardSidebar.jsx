import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Package,
  Sprout,
  Building2,
  CalendarCheck,
  DoorOpen,
  Users,
  Image,
  MapPin,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
} from "lucide-react";

const sidebarSections = [
  {
    label: "Commerce",
    icon: ShoppingBag,
    children: [
      { label: "Orders", path: "/dashboard/orders", icon: Package },
      { label: "Products", path: "/dashboard/products", icon: Sprout },
    ],
  },
  {
    label: "Hospitality",
    icon: Building2,
    children: [
      { label: "Booking", path: "/dashboard/bookings", icon: CalendarCheck },
      { label: "Rooms", path: "/dashboard/rooms", icon: DoorOpen },
    ],
  },
];

const sidebarItems = [
  // { label: "Customers", path: "/dashboard/customers", icon: Users },
  { label: "Gallery", path: "/dashboard/gallery", icon: Image },
  { label: "PinCode Services", path: "/dashboard/pincode", icon: MapPin },
  { label: "Policies", path: "/dashboard/policies", icon: FileText },
  // { label: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  // { label: "Settings", path: "/dashboard/settings", icon: Settings },
];

const GroupItem = ({ item, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  const anyChildActive = item.children.some((child) => isActive(child.path));

  return (
    <div
      className={`sidebar-group ${anyChildActive || isHovered ? "group-active" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`sidebar-item group-header ${anyChildActive ? "active" : ""}`}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        <span className="sidebar-icon-wrap">
          <item.icon size={18} />
        </span>
        <span>{item.label}</span>
        <motion.span
          className="sidebar-chevron"
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </motion.div>

      <AnimatePresence initial={false}>
        {isHovered && (
          <motion.div
            className="sidebar-subitems"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {item.children.map((child, i) => (
              <motion.div
                key={child.path}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              >
                <Link
                  to={child.path}
                  className={`sidebar-subitem ${isActive(child.path) ? "active" : ""}`}
                >
                  <child.icon size={16} />
                  <span>{child.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {(anyChildActive || isHovered) && (
        <motion.div
          className="sidebar-group-indicator"
          layoutId="groupIndicator"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </div>
  );
};

const SidebarLink = ({ item, isActive }) => (
  <Link
    to={item.path}
    className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
  >
    <motion.span
      className="sidebar-icon-wrap"
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      <item.icon size={18} />
    </motion.span>
    <span>{item.label}</span>
    {isActive(item.path) && (
      <motion.span
        className="sidebar-active-dot"
        layoutId="activeDot"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </Link>
);

const DashboardSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <motion.aside
      className="dashboard-sidebar"
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="sidebar-inner">
        <div className="sidebar-section">
          {sidebarSections.map((item) => (
            <GroupItem key={item.label} item={item} isActive={isActive} />
          ))}
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          {sidebarItems.map((item) => (
            <SidebarLink key={item.label} item={item} isActive={isActive} />
          ))}
        </div>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
