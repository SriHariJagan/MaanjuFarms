import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Building2,
  Image as ImageIcon,
  ShoppingBag,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Leaf,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Search,
  Bell,
  ArrowLeftFromLine,
} from "lucide-react";
import { useAuth } from "../../Store/useContext";
import "./AdminLayout.css";

const sidebarItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/products", label: "Products", icon: Package },
  { path: "/admin/villas", label: "Villas & Stays", icon: Building2 },
  { path: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { path: "/admin/customers", label: "Customers", icon: Users },
  { path: "/admin/messages", label: "Messages", icon: MessageSquare },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isCollapsed = !sidebarOpen && !sidebarHover;

  useEffect(() => {
    const saved = localStorage.getItem("adminSidebarOpen");
    if (saved !== null) setSidebarOpen(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("adminSidebarOpen", sidebarOpen);
  }, [sidebarOpen]);

  if (!isAdmin) {
    navigate("/", { replace: true });
    return null;
  }

  const pageTitle = sidebarItems.find(
    (item) => item.end ? location.pathname === "/admin" : location.pathname.startsWith(item.path)
  )?.label || "Dashboard";

  const breadcrumbs = [];
  if (location.pathname !== "/admin") {
    breadcrumbs.push({ label: "Dashboard", path: "/admin" });
    if (pageTitle) breadcrumbs.push({ label: pageTitle, path: location.pathname });
  }

  const getInitials = (name) => {
    if (!name) return "A";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const sidebarWidth = isCollapsed ? 68 : 260;

  return (
    <div className="admin-shell">
      {mobileOpen && (
        <div className="admin-mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`admin-sidebar ${isCollapsed ? "admin-sidebar--collapsed" : ""} ${mobileOpen ? "admin-sidebar--mobile-open" : ""}`}
        onMouseEnter={() => sidebarOpen === false && setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
      >
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <div className="admin-sidebar-logo-icon">
              <Leaf size={22} />
            </div>
            {!isCollapsed && <span className="admin-sidebar-logo-text">Maanjoo</span>}
          </div>
          <button className="admin-sidebar-collapse" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <ChevronDown size={16} className={`admin-sidebar-chevron ${sidebarOpen ? "" : "admin-sidebar-chevron--collapsed"}`} />
          </button>
          <button className="admin-sidebar-close-mobile" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "admin-nav-item--active" : ""}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <div className="admin-nav-icon">
                <item.icon size={18} />
              </div>
              {!isCollapsed && <span className="admin-nav-label">{item.label}</span>}
              {!isCollapsed && (
                <span className={`admin-nav-dot ${location.pathname === item.path || (item.end && location.pathname === "/admin") ? "admin-nav-dot--visible" : ""}`} />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-nav-item admin-nav-item--link"
            onClick={() => navigate("/")}
          >
            <ArrowLeftFromLine size={16} />
            {!isCollapsed && <span className="admin-nav-label">Back to Website</span>}
          </button>
          <button className="admin-nav-item admin-nav-item--logout" onClick={logout}>
            <LogOut size={16} />
            {!isCollapsed && <span className="admin-nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="admin-main" style={{ marginLeft: sidebarWidth }}>
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-topbar-mobile-btn" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="admin-breadcrumb">
              <span className="admin-breadcrumb-current">{pageTitle}</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-topbar-search-wrapper">
              <button className="admin-topbar-icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
                <Search size={18} />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    className="admin-topbar-search-dropdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <input
                      type="text"
                      placeholder="Search anything..."
                      className="admin-topbar-search-input"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="admin-topbar-notif-wrapper">
              <button className="admin-topbar-icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={18} />
                <span className="admin-topbar-notif-dot" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    className="admin-topbar-notif-dropdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <div className="admin-topbar-notif-header">
                      <span className="admin-topbar-notif-title">Notifications</span>
                    </div>
                    <div className="admin-topbar-notif-empty">
                      <Bell size={20} />
                      <p>No new notifications</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="admin-topbar-profile-wrapper">
              <button
                className="admin-topbar-profile-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="admin-topbar-avatar">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="" />
                  ) : (
                    <span>{getInitials(user?.name)}</span>
                  )}
                </div>
                <span className="admin-topbar-profile-name">{user?.name || "Admin"}</span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div className="admin-topbar-overlay" onClick={() => setUserMenuOpen(false)} />
                    <motion.div
                      className="admin-topbar-user-dropdown"
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    >
                      <div className="admin-topbar-user-header">
                        <div className="admin-topbar-user-avatar-lg">
                          {user?.profileImage ? (
                            <img src={user.profileImage} alt="" />
                          ) : (
                            <span>{getInitials(user?.name)}</span>
                          )}
                        </div>
                        <div>
                          <p className="admin-topbar-user-name">{user?.name}</p>
                          <p className="admin-topbar-user-email">{user?.email}</p>
                        </div>
                      </div>
                      <div className="admin-topbar-user-menu">
                        <button className="admin-topbar-user-item" onClick={() => { navigate("/"); setUserMenuOpen(false); }}>
                          <ArrowLeftFromLine size={14} />
                          Back to Website
                        </button>
                        <div className="admin-topbar-user-divider" />
                        <button className="admin-topbar-user-item admin-topbar-user-item--danger" onClick={logout}>
                          <LogOut size={14} />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <motion.main
          className="admin-content"
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
