// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   RefreshCw,
//   Search,
//   X,
//   SlidersHorizontal,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   Edit3,
//   Users,
//   UserCheck,
//   Shield,
//   UserPlus,
//   CalendarDays,
//   ArrowLeft,
//   AlertCircle,
//   Mail,
//   Phone,
//   ShoppingBag,
//   Building2,
//   IndianRupee,
//   Tag,
//   Clock,
// } from "lucide-react";
// import { useAuth } from "../../../Store/useContext";
// import { USERS_API } from "../../../urls";
// import styles from "./CustomersPage.module.css";

// ─── Role Config ────────────────────────────────────────────
const ROLE_BADGES = {
  admin: { bg: "rgba(96,153,102,0.1)", text: "#609966" },
  user: { bg: "rgba(59,130,246,0.1)", text: "#2563eb" },
};

// ─── CustomerRoleBadge ──────────────────────────────────────
const CustomerRoleBadge = ({ role }) => {
  const config = ROLE_BADGES[role] || ROLE_BADGES.user;
  return (
    <span className={styles.roleBadge} style={{ background: config.bg, color: config.text }}>
      {role === "admin" ? "Admin" : "Customer"}
    </span>
  );
};

// ─── Customer Avatar ─────────────────────────────────────────
const CustomerAvatar = ({ name, className = "" }) => {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "??";
  return <span className={`${styles.customerAvatar} ${className}`}>{initials}</span>;
};

// ─── CustomerKPICards ────────────────────────────────────────
const KPI_CARDS = [
  { key: "total", label: "Total Customers", icon: Users, color: "#609966" },
  { key: "active", label: "Active Users", icon: UserCheck, color: "#40513B" },
  { key: "admins", label: "Admins", icon: Shield, color: "#2563eb" },
  { key: "newMonth", label: "New This Month", icon: UserPlus, color: "#d97706" },
];

const CustomerKPICards = ({ users }) => {
  const counts = useMemo(() => {
    const raw = users || [];
    const now = new Date();
    return {
      total: raw.length,
      active: raw.filter((u) => u.role === "user" || u.role === "admin").length,
      admins: raw.filter((u) => u.role === "admin").length,
      newMonth: raw.filter((u) => {
        if (!u.createdAt) return false;
        const d = new Date(u.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
    };
  }, [users]);

  return (
    <div className={styles.kpiGrid}>
      {KPI_CARDS.map((card, i) => (
        <motion.div
          key={card.key}
          className={styles.kpiCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(64,81,59,0.1)" }}
        >
          <div className={styles.kpiTop}>
            <span className={styles.kpiIcon} style={{ background: `${card.color}14`, color: card.color }}>
              <card.icon size={18} />
            </span>
          </div>
          <div className={styles.kpiValue}>{counts[card.key]}</div>
          <div className={styles.kpiLabel}>{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// ─── CustomersHeader ────────────────────────────────────────
const CustomersHeader = ({ onRefresh, refreshing }) => (
  <motion.div
    className={styles.pageHeader}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <div>
      <h1 className={styles.pageTitle}>Customers</h1>
      <p className={styles.pageSubtitle}>Manage all registered users and view their activities.</p>
    </div>
    <div className={styles.headerActions}>
      <motion.button
        className={styles.headerBtn}
        onClick={onRefresh}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        disabled={refreshing}
      >
        <RefreshCw size={16} className={refreshing ? styles.spin : ""} />
        <span>Refresh</span>
      </motion.button>
    </div>
  </motion.div>
);

// ─── CustomersFilters ────────────────────────────────────────
const CustomersFilters = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  sortBy,
  onSortChange,
  onReset,
  resultCount,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <motion.div
      className={styles.filtersWrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <div className={styles.filtersTop}>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => onSearchChange("")}>
              <X size={14} />
            </button>
          )}
        </div>

        <motion.button
          className={`${styles.filterToggle} ${showFilters ? styles.filterToggleActive : ""}`}
          onClick={() => setShowFilters(!showFilters)}
          whileTap={{ scale: 0.95 }}
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          <ChevronDown size={14} className={showFilters ? styles.chevronUp : ""} />
        </motion.button>

        <div className={styles.resultCount}>{resultCount} customers</div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className={styles.filtersBody}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label>Role</label>
                <select value={roleFilter} onChange={(e) => onRoleFilterChange(e.target.value)}>
                  <option value="all">All Roles</option>
                  <option value="user">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Sort By</label>
                <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alpha">Alphabetical (A-Z)</option>
                </select>
              </div>

              <motion.button
                className={styles.resetBtn}
                onClick={onReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <X size={14} />
                Reset Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── CustomersTable ─────────────────────────────────────────
const ROWS_PER_PAGE = 10;

const CustomersTable = ({ users, onViewDetails, onEdit, loading }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(users.length / ROWS_PER_PAGE));
  const paginated = users.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [users.length, page, totalPages]);

  if (loading) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.tableSkeleton}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skelBox} style={{ width: "5%" }} />
              <div className={styles.skelBox} style={{ width: "18%" }} />
              <div className={styles.skelBox} style={{ width: "22%" }} />
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "12%" }} />
              <div className={styles.skelBox} style={{ width: "8%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <motion.div
        className={styles.emptyState}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.emptyIcon}>
          <Users size={48} />
        </div>
        <h3 className={styles.emptyTitle}>No Customers Found</h3>
        <p className={styles.emptyText}>No customers match your current filters. Try adjusting your search or filter criteria.</p>
      </motion.div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableInfo}>
        <span className={styles.tableInfoText}>
          Showing <strong>{(page - 1) * ROWS_PER_PAGE + 1}</strong>–<strong>{Math.min(page * ROWS_PER_PAGE, users.length)}</strong> of <strong>{users.length}</strong> customers
        </span>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.customerTable}>
          <thead>
            <tr>
              <th className={styles.colCenter} style={{ width: 50 }}>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th className={styles.colCenter}>Role</th>
              <th className={styles.colCenter}>Orders</th>
              <th className={styles.colCenter}>Bookings</th>
              <th>Joined</th>
              <th className={styles.colCenter}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginated.map((user) => (
                <motion.tr
                  key={user._id}
                  className={styles.tableRow}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <td className={styles.colCenter}>
                    <CustomerAvatar name={user.name} className={styles.tableAvatar} />
                  </td>
                  <td>
                    <span className={styles.cellName}>{user.name || "N/A"}</span>
                  </td>
                  <td>
                    <span className={styles.cellEmail}>{user.email || ""}</span>
                  </td>
                  <td className={styles.colCenter}>
                    <CustomerRoleBadge role={user.role} />
                  </td>
                  <td className={styles.colCenter}>
                    <span className={styles.cellCount}>{user.totalOrders ?? "-"}</span>
                  </td>
                  <td className={styles.colCenter}>
                    <span className={styles.cellCount}>{user.totalBookings ?? "-"}</span>
                  </td>
                  <td>
                    <span className={styles.cellDate}>
                      <CalendarDays size={13} />
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.cellActions}>
                      <motion.button
                        className={styles.actionBtn}
                        onClick={() => onViewDetails(user)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="View Profile"
                      >
                        <Eye size={15} />
                      </motion.button>
                      <motion.button
                        className={styles.actionBtn}
                        onClick={() => onEdit(user)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit Customer"
                      >
                        <Edit3 size={15} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Page {page} of {totalPages}
          </div>
          <div className={styles.paginationControls}>
            <motion.button
              className={styles.pageBtn}
              onClick={() => setPage(1)}
              disabled={page === 1}
              whileTap={{ scale: 0.95 }}
              title="First page"
            >
              <span className={styles.pageBtnIcon}>{`\u00ab`}</span>
            </motion.button>
            <motion.button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              whileTap={{ scale: 0.95 }}
              title="Previous page"
            >
              <ChevronLeft size={15} />
            </motion.button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className={styles.pageEllipsis}>...</span>}
                    <motion.button
                      className={`${styles.pageBtn} ${styles.pageNum} ${p === page ? styles.pageBtnActive : ""}`}
                      onClick={() => setPage(p)}
                      whileTap={{ scale: 0.95 }}
                    >
                      {p}
                    </motion.button>
                  </React.Fragment>
                ))}
            </div>
            <motion.button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              whileTap={{ scale: 0.95 }}
              title="Next page"
            >
              <ChevronRight size={15} />
            </motion.button>
            <motion.button
              className={styles.pageBtn}
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              whileTap={{ scale: 0.95 }}
              title="Last page"
            >
              <span className={styles.pageBtnIcon}>{`\u00bb`}</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CustomerDrawer ──────────────────────────────────────────
const CustomerDrawer = ({ user, onClose, onSave, saving, userDetail, detailLoading }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const profile = userDetail || user;

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  if (!user) return null;

  const handleSave = () => {
    onSave(user._id, form);
    setEditMode(false);
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "orders", label: "Orders" },
    { key: "bookings", label: "Bookings" },
  ];

  return (
    <motion.div
      className={styles.drawerOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.drawer}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.drawerHeader}>
          <button className={styles.drawerClose} onClick={onClose}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className={styles.drawerTitle}>Customer Profile</h2>
            <span className={styles.drawerSub}>{user.name || user.email}</span>
          </div>
          <CustomerRoleBadge role={user.role} />
        </div>

        {/* Tabs */}
        <div className={styles.drawerTabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.drawerTab} ${activeTab === tab.key ? styles.drawerTabActive : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.drawerBody}>
          {activeTab === "overview" && (
            <OverviewTab
              profile={profile}
              editMode={editMode}
              form={form}
              onFormChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              onEditToggle={() => setEditMode(!editMode)}
              onSave={handleSave}
              saving={saving}
              loading={detailLoading}
            />
          )}
          {activeTab === "orders" && <OrdersTab userId={user._id} />}
          {activeTab === "bookings" && <BookingsTab userId={user._id} />}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Overview Tab ────────────────────────────────────────────
const OverviewTab = ({ profile, editMode, form, onFormChange, onEditToggle, onSave, saving, loading }) => {
  if (loading) {
    return (
      <div className={styles.tabSkeleton}>
        <div className={styles.skelBox} style={{ width: "100%", height: 160, borderRadius: 12 }} />
        <div className={styles.skelBox} style={{ width: "60%", height: 20 }} />
        <div className={styles.skelBox} style={{ width: "80%", height: 14 }} />
        <div className={styles.skelBox} style={{ width: "40%", height: 14 }} />
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      {/* Profile Card */}
      <section className={styles.drawerSection}>
        <div className={styles.profileCard}>
          <CustomerAvatar name={profile.name} className={styles.profileAvatar} />
          <div className={styles.profileInfo}>
            {editMode ? (
              <div className={styles.editFields}>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onFormChange}
                  placeholder="Full Name"
                  className={styles.editInput}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onFormChange}
                  placeholder="Email"
                  className={styles.editInput}
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={onFormChange}
                  placeholder="Phone"
                  className={styles.editInput}
                />
              </div>
            ) : (
              <>
                <h3 className={styles.profileName}>{profile.name || "N/A"}</h3>
                <div className={styles.profileMeta}>
                  <Mail size={13} />
                  {profile.email || "—"}
                </div>
                {profile.phone && (
                  <div className={styles.profileMeta}>
                    <Phone size={13} />
                    {profile.phone}
                  </div>
                )}
              </>
            )}
          </div>
          <div className={styles.profileActions}>
            <motion.button
              className={styles.editProfileBtn}
              onClick={onEditToggle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {editMode ? "Cancel" : "Edit"}
            </motion.button>
            {editMode && (
              <motion.button
                className={styles.saveProfileBtn}
                onClick={onSave}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {saving ? "Saving..." : "Save"}
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className={styles.drawerSection}>
        <h3 className={styles.drawerSectionTitle}>Statistics</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <ShoppingBag size={16} />
            <div>
              <label>Total Orders</label>
              <p>{profile.totalOrders ?? "-"}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <Building2 size={16} />
            <div>
              <label>Total Bookings</label>
              <p>{profile.totalBookings ?? "-"}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <IndianRupee size={16} />
            <div>
              <label>Total Spent</label>
              <p>{profile.totalSpent != null ? `₹${profile.totalSpent.toLocaleString()}` : "-"}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <Tag size={16} />
            <div>
              <label>Avg. Order Value</label>
              <p>{profile.avgOrderValue != null ? `₹${profile.avgOrderValue.toLocaleString()}` : "-"}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <Tag size={16} />
            <div>
              <label>Avg. Booking Value</label>
              <p>{profile.avgBookingValue != null ? `₹${profile.avgBookingValue.toLocaleString()}` : "-"}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <CalendarDays size={16} />
            <div>
              <label>Joined</label>
              <p>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className={styles.drawerSection}>
        <h3 className={styles.drawerSectionTitle}>Details</h3>
        <div className={styles.drawerInfoGrid}>
          <div className={styles.drawerInfoItem}>
            <Tag size={15} />
            <div>
              <label>User ID</label>
              <p className={styles.mono}>{profile._id}</p>
            </div>
          </div>
          <div className={styles.drawerInfoItem}>
            <Shield size={15} />
            <div>
              <label>Role</label>
              <p>{profile.role === "admin" ? "Admin" : "Customer"}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Orders Tab ──────────────────────────────────────────────
const OrdersTab = ({ userId }) => {
  /* TODO: Fetch user-specific orders when backend supports it
     const [orders, setOrders] = useState([]);
     useEffect(() => {
       axios.get(ORDERS_API.MY_ORDERS, { params: { userId } })...
     }, [userId]);
  */
  return (
    <div className={styles.tabPlaceholder}>
      <ShoppingBag size={36} />
      <h3>No Order Data Available</h3>
      <p>User order history will appear here once the backend provides it.</p>
    </div>
  );
};

// ─── Bookings Tab ────────────────────────────────────────────
const BookingsTab = ({ userId }) => {
  /* TODO: Fetch user-specific bookings when backend supports it */
  return (
    <div className={styles.tabPlaceholder}>
      <Building2 size={36} />
      <h3>No Booking Data Available</h3>
      <p>User booking history will appear here once the backend provides it.</p>
    </div>
  );
};

// ─── Error State ──────────────────────────────────────────────
const ErrorState = ({ message, onRetry }) => (
  <motion.div
    className={styles.errorState}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <AlertCircle size={48} />
    <h3>Failed to load customers</h3>
    <p>{message || "Something went wrong. Please try again."}</p>
    <motion.button
      className={styles.retryBtn}
      onClick={onRetry}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <RefreshCw size={16} />
      Try Again
    </motion.button>
  </motion.div>
);

// ─── CustomersPage (Main) ────────────────────────────────────
const CustomersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Drawer
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);

  // ─── Fetch Users ───────────────────────────────────────────
  const fetchUsers = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await axios.get(USERS_API.ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.users || res.data.data || [];
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  // ─── Fetch User Detail for Drawer ──────────────────────────
  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setUserDetail(null);
    try {
      setDetailLoading(true);
      const res = await axios.get(USERS_API.DETAILS(user._id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetail(res.data.user || res.data.data || res.data);
    } catch (err) {
      // If detail endpoint fails, fall back to list data
      setUserDetail(user);
    } finally {
      setDetailLoading(false);
    }
  };

  // ─── Edit User ─────────────────────────────────────────────
  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setUserDetail(null);
    handleViewDetails(user);
  };

  // ─── Save User ─────────────────────────────────────────────
  const handleSaveUser = async (id, data) => {
    try {
      setSaving(true);
      await axios.put(USERS_API.UPDATE(id), data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...data } : u)),
      );
      setUserDetail((prev) => (prev ? { ...prev, ...data } : prev));
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  // ─── Filtered & Sorted ─────────────────────────────────────
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q),
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "alpha":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return result;
  }, [users, search, roleFilter, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setSortBy("newest");
  };

  return (
    <div className={styles.customersPage}>
      <CustomersHeader onRefresh={() => fetchUsers(true)} refreshing={refreshing} />

      <CustomerKPICards users={users} />

      <CustomersFilters
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={resetFilters}
        resultCount={filteredUsers.length}
      />

      {error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : (
        <CustomersTable
          users={filteredUsers}
          onViewDetails={handleViewDetails}
          onEdit={handleOpenEdit}
          loading={loading}
        />
      )}

      <AnimatePresence>
        {selectedUser && (
          <CustomerDrawer
            user={selectedUser}
            userDetail={userDetail}
            detailLoading={detailLoading}
            onClose={() => { setSelectedUser(null); setUserDetail(null); }}
            onSave={handleSaveUser}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomersPage;
