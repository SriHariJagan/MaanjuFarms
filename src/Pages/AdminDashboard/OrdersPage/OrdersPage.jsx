import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Download,
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Package,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Hash,
  CalendarDays,
  Camera,
  IndianRupee,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../../Store/useContext";
import { API_BASE, ORDERS_API } from "../../../urls";
import { getImageUrl, formatPriceWithUnit } from "../../../utils/getImageUrl ";
import styles from "./OrdersPage.module.css";

// ─── Status Config ───────────────────────────────────────────
const STATUS_COLORS = {
  Pending: { bg: "rgba(245,158,11,0.1)", text: "#d97706" },
  Confirmed: { bg: "rgba(96,153,102,0.1)", text: "#609966" },
  Processing: { bg: "rgba(59,130,246,0.1)", text: "#2563eb" },
  Shipped: { bg: "rgba(59,130,246,0.1)", text: "#2563eb" },
  Delivered: { bg: "rgba(96,153,102,0.15)", text: "#40513B" },
  Cancelled: { bg: "rgba(239,68,68,0.1)", text: "#ef4444" },
};

const PAYMENT_COLORS = {
  paid: { bg: "rgba(96,153,102,0.12)", text: "#609966" },
  pending: { bg: "rgba(245,158,11,0.1)", text: "#d97706" },
  failed: { bg: "rgba(239,68,68,0.1)", text: "#ef4444" },
  refunded: { bg: "rgba(96,153,102,0.12)", text: "#609966" },
};

// ─── OrderStatusBadge ────────────────────────────────────────
const OrderStatusBadge = ({ status, className = "" }) => {
  const config = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  return (
    <span
      className={`${styles.statusBadge} ${className}`}
      style={{ background: config.bg, color: config.text }}
    >
      {status}
    </span>
  );
};

// ─── OrderKPICards ───────────────────────────────────────────
const KPI_CARDS = [
  { key: "total", label: "Total Orders", icon: ClipboardList, color: "#609966" },
  { key: "pending", label: "Pending", icon: Clock, color: "#d97706" },
  { key: "processing", label: "Processing", icon: Package, color: "#2563eb" },
  { key: "delivered", label: "Delivered", icon: CheckCircle, color: "#40513B" },
  { key: "cancelled", label: "Cancelled", icon: XCircle, color: "#ef4444" },
];

const OrderKPICards = ({ orders }) => {
  const counts = useMemo(() => {
    const raw = orders || [];
    return {
      total: raw.length,
      pending: raw.filter((o) => o.status === "Pending").length,
      processing: raw.filter((o) => o.status === "Processing" || o.status === "Confirmed" || o.status === "Shipped").length,
      delivered: raw.filter((o) => o.status === "Delivered").length,
      cancelled: raw.filter((o) => o.status === "Cancelled").length,
    };
  }, [orders]);

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

// ─── OrdersHeader ────────────────────────────────────────────
const OrdersHeader = ({ onRefresh, refreshing }) => (
  <motion.div
    className={styles.pageHeader}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <div>
      <h1 className={styles.pageTitle}>Orders</h1>
      <p className={styles.pageSubtitle}>Manage and monitor all customer product orders.</p>
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
      <motion.button
        className={`${styles.headerBtn} ${styles.exportBtn}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        title="Export (UI only)"
      >
        <Download size={16} />
        <span>Export</span>
      </motion.button>
    </div>
  </motion.div>
);

// ─── OrdersFilters ───────────────────────────────────────────
const OrdersFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  paymentFilter,
  onPaymentFilterChange,
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
            placeholder="Search by Order ID or Customer Name..."
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

        <div className={styles.resultCount}>{resultCount} orders</div>
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
                <label>Status</label>
                <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Payment</label>
                <select value={paymentFilter} onChange={(e) => onPaymentFilterChange(e.target.value)}>
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Sort By</label>
                <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Amount: High to Low</option>
                  <option value="amount-low">Amount: Low to High</option>
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

// ─── Order Status Dot ────────────────────────────────────────
const StatusDot = ({ status }) => {
  const colors = {
    Pending: "#d97706",
    Confirmed: "#609966",
    Processing: "#2563eb",
    Shipped: "#2563eb",
    Delivered: "#40513B",
    Cancelled: "#ef4444",
  };
  return (
    <span
      className={styles.statusDot}
      style={{ background: colors[status] || "#d97706" }}
    />
  );
};

// ─── Customer Avatar ─────────────────────────────────────────
const CustomerAvatar = ({ name }) => {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "??";
  return <span className={styles.customerAvatar}>{initials}</span>;
};

// ─── OrdersTable ─────────────────────────────────────────────
const ROWS_PER_PAGE = 10;

const OrdersTable = ({
  orders,
  onViewDetails,
  onUpdateStatus,
  loading,
  updatingId,
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(orders.length / ROWS_PER_PAGE));
  const paginated = orders.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [orders.length, page, totalPages]);

  if (loading) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.tableSkeleton}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skelBox} style={{ width: "8%" }} />
              <div className={styles.skelBox} style={{ width: "16%" }} />
              <div className={styles.skelBox} style={{ width: "8%" }} />
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "12%" }} />
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "6%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div
        className={styles.emptyState}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.emptyIcon}>
          <ClipboardList size={48} />
        </div>
        <h3 className={styles.emptyTitle}>No Orders Found</h3>
        <p className={styles.emptyText}>No orders match your current filters. Try adjusting your search or filter criteria.</p>
      </motion.div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableInfo}>
        <span className={styles.tableInfoText}>
          Showing <strong>{(page - 1) * ROWS_PER_PAGE + 1}</strong>–<strong>{Math.min(page * ROWS_PER_PAGE, orders.length)}</strong> of <strong>{orders.length}</strong> orders
        </span>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th className={styles.colCenter}>Items</th>
              <th className={styles.colRight}>Total</th>
              <th className={styles.colCenter}>Payment</th>
              <th className={styles.colCenter}>Status</th>
              <th>Date</th>
              <th className={styles.colCenter}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginated.map((order) => (
                <motion.tr
                  key={order._id}
                  className={styles.tableRow}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <td>
                    <span className={styles.cellId}>#{order._id.slice(-8)}</span>
                  </td>
                  <td>
                    <div className={styles.cellCustomer}>
                      <CustomerAvatar name={order.user?.name} />
                      <div className={styles.customerInfo}>
                        <span className={styles.customerName}>{order.user?.name || "N/A"}</span>
                        <span className={styles.customerEmail}>{order.user?.email || ""}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.colCenter}>
                    <span className={styles.cellItems}>
                      <Package size={14} />
                      {order.products?.length || 0}
                    </span>
                  </td>
                  <td className={styles.colRight}>
                    <span className={styles.cellAmount}>
                      <IndianRupee size={12} />
                      {(order.totalAmount || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className={styles.colCenter}>
                    <span
                      className={styles.paymentChip}
                      style={(PAYMENT_COLORS[order.paymentStatus] || PAYMENT_COLORS.pending)}
                    >
                      {order.paymentStatus || "N/A"}
                    </span>
                  </td>
                  <td className={styles.colCenter}>
                    <span className={styles.statusBadge} style={(STATUS_COLORS[order.status] || STATUS_COLORS.Pending)}>
                      <StatusDot status={order.status} />
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={styles.cellDate}>
                      <CalendarDays size={13} />
                      {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </td>
                  <td>
                    <div className={styles.cellActions}>
                      <motion.button
                        className={styles.actionBtn}
                        onClick={() => onViewDetails(order)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="View Details"
                      >
                        <Eye size={15} />
                      </motion.button>
                      <motion.button
                        className={styles.actionBtn}
                        onClick={() => onUpdateStatus(order)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Update Status"
                        disabled={updatingId === order._id}
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

// ─── OrderTimeline ───────────────────────────────────────────
const timelineSteps = [
  { key: "created", label: "Created", icon: ClipboardList },
  { key: "paid", label: "Paid", icon: CreditCard },
  { key: "processing", label: "Processing", icon: Package },
  { key: "delivered", label: "Delivered", icon: Truck },
];

const OrderTimeline = ({ order }) => {
  const statusMap = {
    Pending: ["created"],
    Confirmed: ["created", "paid"],
    Processing: ["created", "paid", "processing"],
    Shipped: ["created", "paid", "processing"],
    Delivered: ["created", "paid", "processing", "delivered"],
    Cancelled: ["created"],
  };

  const steps = statusMap[order.status] || ["created"];

  return (
    <div className={styles.timeline}>
      {timelineSteps.map((step, i) => {
        const isActive = steps.includes(step.key);
        return (
          <div key={step.key} className={`${styles.timelineStep} ${isActive ? styles.timelineActive : ""}`}>
            <div className={styles.timelineDot}>
              <step.icon size={14} />
            </div>
            <div className={styles.timelineContent}>
              <span className={styles.timelineLabel}>{step.label}</span>
            </div>
            {i < timelineSteps.length - 1 && <div className={`${styles.timelineLine} ${isActive ? styles.timelineLineActive : ""}`} />}
          </div>
        );
      })}
    </div>
  );
};

// ─── OrderDrawer ─────────────────────────────────────────────
const OrderDrawer = ({ order, onClose, onStatusChange, updating }) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "Pending");

  if (!order) return null;

  const handleUpdate = () => {
    if (selectedStatus !== order.status) {
      onStatusChange(order._id, selectedStatus);
    }
  };

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
            <h2 className={styles.drawerTitle}>Order Details</h2>
            <span className={styles.drawerSub}>#{order._id.slice(-8)}</span>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className={styles.drawerBody}>
          {/* Timeline */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Timeline</h3>
            <OrderTimeline order={order} />
          </section>

          {/* Customer Information */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Customer Information</h3>
            <div className={styles.drawerInfoGrid}>
              <div className={styles.drawerInfoItem}>
                <User size={15} />
                <div>
                  <label>Name</label>
                  <p>{order.user?.name || "N/A"}</p>
                </div>
              </div>
              <div className={styles.drawerInfoItem}>
                <Mail size={15} />
                <div>
                  <label>Email</label>
                  <p>{order.user?.email || "N/A"}</p>
                </div>
              </div>
              {order.deliveryAddress?.phone && (
                <div className={styles.drawerInfoItem}>
                  <Phone size={15} />
                  <div>
                    <label>Phone</label>
                    <p>{order.deliveryAddress.phone}</p>
                  </div>
                </div>
              )}
            </div>
            {order.formattedAddress && (
              <div className={styles.drawerInfoItem} style={{ marginTop: 8 }}>
                <MapPin size={15} />
                <div>
                  <label>Delivery Address</label>
                  <p>{order.formattedAddress}</p>
                </div>
              </div>
            )}
          </section>

          {/* Products */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Products ({order.products?.length || 0})</h3>
            <div className={styles.drawerProducts}>
              {order.products?.map((item, i) => (
                <div key={item._id || i} className={styles.drawerProduct}>
                  <div className={styles.dpImageWrap}>
                    {item.product?.image ? (
                      <img src={getImageUrl(item.product.image)} alt={item.product?.name} />
                    ) : (
                      <Camera size={18} />
                    )}
                  </div>
                  <div className={styles.dpInfo}>
                    <p className={styles.dpName}>{item.product?.name || "Unknown Product"}</p>
                    <span className={styles.dpMeta}>Qty: {item.quantity}</span>
                  </div>
                  <div className={styles.dpPrice}>
                    {formatPriceWithUnit(item.product?.price, item.product?.unit)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Payment</h3>
            <div className={styles.drawerInfoGrid}>
              <div className={styles.drawerInfoItem}>
                <CreditCard size={15} />
                <div>
                  <label>Payment Status</label>
                  <p style={{ color: (PAYMENT_COLORS[order.paymentStatus] || {}).text }}>{order.paymentStatus || "N/A"}</p>
                </div>
              </div>
              {order.paymentId && (
                <div className={styles.drawerInfoItem}>
                  <Hash size={15} />
                  <div>
                    <label>Payment ID</label>
                    <p className={styles.mono}>{order.paymentId}</p>
                  </div>
                </div>
              )}
              {order.paidAt && (
                <div className={styles.drawerInfoItem}>
                  <CalendarDays size={15} />
                  <div>
                    <label>Paid At</label>
                    <p>{new Date(order.paidAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.drawerTotal}>
              <span>Total Amount</span>
              <strong><IndianRupee size={14} />{order.totalAmount?.toLocaleString?.() || order.totalAmount}</strong>
            </div>
          </section>

          {/* Shipping */}
          {(order.trackingId || order.courierName) && (
            <section className={styles.drawerSection}>
              <h3 className={styles.drawerSectionTitle}>Shipping</h3>
              <div className={styles.drawerInfoGrid}>
                {order.trackingId && (
                  <div className={styles.drawerInfoItem}>
                    <Hash size={15} />
                    <div>
                      <label>Tracking ID</label>
                      <p className={styles.mono}>{order.trackingId}</p>
                    </div>
                  </div>
                )}
                {order.courierName && (
                  <div className={styles.drawerInfoItem}>
                    <Truck size={15} />
                    <div>
                      <label>Courier</label>
                      <p>{order.courierName}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Update Status */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Update Status</h3>
            <div className={styles.updateRow}>
              <select
                className={styles.statusSelect}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <motion.button
                className={styles.updateBtn}
                onClick={handleUpdate}
                disabled={selectedStatus === order.status || updating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {updating ? "Updating..." : "Update"}
              </motion.button>
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
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
    <h3>Failed to load orders</h3>
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

// ─── OrdersPage (Main) ──────────────────────────────────────
const OrdersPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Drawer
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerUpdating, setDrawerUpdating] = useState(false);

  // ─── Fetch Orders ──────────────────────────────────────────
  const fetchOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await axios.get(ORDERS_API.ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.orders || res.data.data || [];
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  // ─── Update Status ─────────────────────────────────────────
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      setDrawerUpdating(true);
      await axios.put(
        ORDERS_API.UPDATE(id),
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o)),
      );
      if (selectedOrder?._id === id) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdatingId(null);
      setDrawerUpdating(false);
    }
  };

  // ─── Filtered & Sorted ─────────────────────────────────────
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o._id?.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (paymentFilter !== "all") {
      result = result.filter((o) => o.paymentStatus === paymentFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "amount-high":
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        case "amount-low":
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [orders, search, statusFilter, paymentFilter, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setSortBy("newest");
  };

  return (
    <div className={styles.ordersPage}>
      <OrdersHeader onRefresh={() => fetchOrders(true)} refreshing={refreshing} />

      <OrderKPICards orders={filteredOrders} />

      <OrdersFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={setPaymentFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={resetFilters}
        resultCount={filteredOrders.length}
      />

      {error ? (
        <ErrorState message={error} onRetry={() => fetchOrders()} />
      ) : (
        <OrdersTable
          orders={filteredOrders}
          onViewDetails={(order) => setSelectedOrder(order)}
          onUpdateStatus={(order) => setSelectedOrder(order)}
          loading={loading}
          updatingId={updatingId}
        />
      )}

      <AnimatePresence>
        {selectedOrder && (
          <OrderDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleUpdateStatus}
            updating={drawerUpdating}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
