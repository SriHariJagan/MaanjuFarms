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
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  User,
  Mail,
  Phone,
  CalendarDays,
  Users,
  IndianRupee,
  CreditCard,
  Hash,
  ArrowLeft,
  AlertCircle,
  CalendarCheck,
  DoorOpen,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../../Store/useContext";
import { BOOKINGS_API } from "../../../urls";
import styles from "./BookingsPage.module.css";

// ─── Status Config ───────────────────────────────────────────
const STATUS_COLORS = {
  Upcoming: { bg: "rgba(59,130,246,0.1)", text: "#2563eb" },
  Ongoing: { bg: "rgba(245,158,11,0.1)", text: "#d97706" },
  Completed: { bg: "rgba(96,153,102,0.15)", text: "#40513B" },
  Cancelled: { bg: "rgba(239,68,68,0.1)", text: "#ef4444" },
};

const PAYMENT_COLORS = {
  paid: { bg: "rgba(96,153,102,0.12)", text: "#609966" },
  pending: { bg: "rgba(245,158,11,0.1)", text: "#d97706" },
  failed: { bg: "rgba(239,68,68,0.1)", text: "#ef4444" },
  refunded: { bg: "rgba(96,153,102,0.12)", text: "#609966" },
};

const getBookingStatus = (b) => {
  if (b.status === "Cancelled") return "Cancelled";
  const now = new Date();
  if (now < new Date(b.checkIn)) return "Upcoming";
  if (now > new Date(b.checkOut)) return "Completed";
  return "Ongoing";
};

// ─── BookingStatusBadge ──────────────────────────────────────
const BookingStatusBadge = ({ status }) => {
  const config = STATUS_COLORS[status] || STATUS_COLORS.Upcoming;
  return (
    <span className={styles.statusBadge} style={{ background: config.bg, color: config.text }}>
      <span className={styles.statusDot} style={{ background: config.text }} />
      {status}
    </span>
  );
};

// ─── PaymentChip ─────────────────────────────────────────────
const PaymentChip = ({ status }) => {
  const config = PAYMENT_COLORS[status] || PAYMENT_COLORS.pending;
  return (
    <span className={styles.paymentChip} style={{ background: config.bg, color: config.text }}>
      {status || "N/A"}
    </span>
  );
};

// ─── BookingKPICards ─────────────────────────────────────────
const KPI_CARDS = [
  { key: "total", label: "Total Bookings", icon: ClipboardList, color: "#609966" },
  { key: "upcoming", label: "Upcoming", icon: Clock, color: "#2563eb" },
  { key: "ongoing", label: "Ongoing", icon: Building2, color: "#d97706" },
  { key: "completed", label: "Completed", icon: CheckCircle, color: "#40513B" },
  { key: "cancelled", label: "Cancelled", icon: XCircle, color: "#ef4444" },
];

const BookingKPICards = ({ bookings }) => {
  const counts = useMemo(() => {
    const raw = bookings || [];
    return {
      total: raw.length,
      upcoming: raw.filter((b) => getBookingStatus(b) === "Upcoming").length,
      ongoing: raw.filter((b) => getBookingStatus(b) === "Ongoing").length,
      completed: raw.filter((b) => getBookingStatus(b) === "Completed").length,
      cancelled: raw.filter((b) => getBookingStatus(b) === "Cancelled").length,
    };
  }, [bookings]);

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

// ─── BookingsHeader ──────────────────────────────────────────
const BookingsHeader = ({ onRefresh, refreshing, viewMode, onViewModeChange }) => (
  <motion.div
    className={styles.pageHeader}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <div>
      <h1 className={styles.pageTitle}>Bookings</h1>
      <p className={styles.pageSubtitle}>Manage and monitor all villa bookings.</p>
    </div>
    <div className={styles.headerActions}>
      <div className={styles.viewToggle}>
        <motion.button
          className={`${styles.viewToggleBtn} ${viewMode === "table" ? styles.viewToggleActive : ""}`}
          onClick={() => onViewModeChange("table")}
          whileTap={{ scale: 0.95 }}
        >
          Table
        </motion.button>
        <motion.button
          className={`${styles.viewToggleBtn} ${viewMode === "calendar" ? styles.viewToggleActive : ""}`}
          onClick={() => onViewModeChange("calendar")}
          whileTap={{ scale: 0.95 }}
        >
          Calendar
        </motion.button>
      </div>
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

// ─── BookingsFilters ─────────────────────────────────────────
const BookingsFilters = ({
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
            placeholder="Search by booking ID, customer, or room..."
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

        <div className={styles.resultCount}>{resultCount} bookings</div>
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
                <label>Booking Status</label>
                <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
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
                  <option value="checkin">Check-In Date</option>
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

// ─── BookingsTable ───────────────────────────────────────────
const ROWS_PER_PAGE = 10;

const BookingsTable = ({ bookings, onViewDetails, loading }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(bookings.length / ROWS_PER_PAGE));
  const paginated = bookings.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [bookings.length, page, totalPages]);

  if (loading) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.tableSkeleton}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skelBox} style={{ width: "8%" }} />
              <div className={styles.skelBox} style={{ width: "16%" }} />
              <div className={styles.skelBox} style={{ width: "14%" }} />
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "8%" }} />
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "6%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <motion.div
        className={styles.emptyState}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.emptyIcon}>
          <Building2 size={48} />
        </div>
        <h3 className={styles.emptyTitle}>No Bookings Found</h3>
        <p className={styles.emptyText}>No bookings match your current filters. Try adjusting your search or filter criteria.</p>
      </motion.div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableInfo}>
        <span className={styles.tableInfoText}>
          Showing <strong>{(page - 1) * ROWS_PER_PAGE + 1}</strong>–<strong>{Math.min(page * ROWS_PER_PAGE, bookings.length)}</strong> of <strong>{bookings.length}</strong> bookings
        </span>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.bookingsTable}>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Room</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th className={styles.colCenter}>Guests</th>
              <th className={styles.colRight}>Amount</th>
              <th className={styles.colCenter}>Payment</th>
              <th className={styles.colCenter}>Status</th>
              <th className={styles.colCenter}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginated.map((booking) => (
                <motion.tr
                  key={booking._id}
                  className={styles.tableRow}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <td>
                    <span className={styles.cellId}>#{booking._id.slice(-8)}</span>
                  </td>
                  <td>
                    <div className={styles.cellCustomer}>
                      <span className={styles.customerAvatar}>
                        {(booking.user?.name || "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                      </span>
                      <div className={styles.customerInfo}>
                        <span className={styles.customerName}>{booking.user?.name || "N/A"}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.cellRoom}>
                      <DoorOpen size={13} />
                      {booking.room?.name || "—"}
                    </span>
                  </td>
                  <td>
                    <span className={styles.cellDate}>
                      <CalendarDays size={12} />
                      {new Date(booking.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </td>
                  <td>
                    <span className={styles.cellDate}>
                      <CalendarDays size={12} />
                      {new Date(booking.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </td>
                  <td className={styles.colCenter}>
                    <span className={styles.cellGuests}>
                      <Users size={13} />
                      {booking.guests ?? 1}
                    </span>
                  </td>
                  <td className={styles.colRight}>
                    <span className={styles.cellAmount}>
                      <IndianRupee size={12} />
                      {(booking.totalPrice || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className={styles.colCenter}>
                    <PaymentChip status={booking.paymentStatus} />
                  </td>
                  <td className={styles.colCenter}>
                    <BookingStatusBadge status={getBookingStatus(booking)} />
                  </td>
                  <td>
                    <div className={styles.cellActions}>
                      <motion.button
                        className={styles.actionBtn}
                        onClick={() => onViewDetails(booking)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="View Details"
                      >
                        <Eye size={15} />
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
              <span className={`${styles.pageBtnIcon}`}>{`\u00ab`}</span>
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
              <span className={`${styles.pageBtnIcon}`}>{`\u00bb`}</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Booking Timeline ─────────────────────────────────────────
const BookingTimeline = ({ booking }) => {
  const status = getBookingStatus(booking);
  const steps = [
    { key: "created", label: "Booked", icon: CalendarCheck, date: booking.createdAt },
    { key: "paid", label: "Paid", icon: CreditCard, date: booking.paidAt || (booking.paymentStatus === "paid" ? booking.createdAt : null) },
    { key: "ongoing", label: "Ongoing", icon: Building2, date: status === "Ongoing" || status === "Completed" ? booking.checkIn : null },
    { key: "completed", label: "Completed", icon: CheckCircle, date: status === "Completed" ? booking.checkOut : null },
  ];

  const statusMap = {
    Upcoming: ["created", "paid"],
    Ongoing: ["created", "paid", "ongoing"],
    Completed: ["created", "paid", "ongoing", "completed"],
    Cancelled: ["created"],
  };

  const activeSteps = statusMap[status] || ["created"];

  return (
    <div className={styles.timeline}>
      {steps.map((step, i) => {
        const isActive = activeSteps.includes(step.key);
        return (
          <div key={step.key} className={`${styles.timelineStep} ${isActive ? styles.timelineActive : ""}`}>
            <div className={styles.timelineDot}>
              <step.icon size={13} />
            </div>
            <div className={styles.timelineContent}>
              <span className={styles.timelineLabel}>{step.label}</span>
              {step.date && <span className={styles.timelineDate}>{new Date(step.date).toLocaleDateString()}</span>}
            </div>
            {i < steps.length - 1 && (
              <div className={`${styles.timelineLine} ${isActive ? styles.timelineLineActive : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Calendar View (Simplified) ──────────────────────────────
const CalendarView = ({ bookings }) => {
  const grouped = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().split("T")[0];
        if (!map[key]) map[key] = [];
        map[key].push(b);
      }
    });
    return map;
  }, [bookings]);

  const today = new Date();
  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.calendarHeader}>
        <span className={styles.calendarTitle}>Next 30 Days — Occupancy Overview</span>
      </div>
      <div className={styles.calendarGrid}>
        {dates.map((date) => {
          const dayBookings = grouped[date] || [];
          const d = new Date(date);
          const isToday = d.toDateString() === today.toDateString();
          return (
            <div key={date} className={`${styles.calendarDay} ${isToday ? styles.calendarToday : ""}`}>
              <div className={styles.calendarDate}>
                <span className={styles.calendarDayName}>{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                <span className={styles.calendarDayNum}>{d.getDate()}</span>
              </div>
              <div className={styles.calendarBookings}>
                {dayBookings.length === 0 ? (
                  <span className={styles.calendarEmpty}>—</span>
                ) : (
                  dayBookings.map((b) => (
                    <div key={b._id} className={`${styles.calendarBooking} ${styles[`calBooking_${getBookingStatus(b)}`]}`}>
                      {b.room?.name || "Room"}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── BookingDrawer ───────────────────────────────────────────
const BookingDrawer = ({ booking, onClose }) => {
  if (!booking) return null;

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
            <h2 className={styles.drawerTitle}>Booking Details</h2>
            <span className={styles.drawerSub}>#{booking._id.slice(-8)}</span>
          </div>
          <BookingStatusBadge status={getBookingStatus(booking)} />
        </div>

        <div className={styles.drawerBody}>
          {/* Timeline */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Timeline</h3>
            <BookingTimeline booking={booking} />
          </section>

          {/* Customer Information */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Customer Information</h3>
            <div className={styles.drawerInfoGrid}>
              <div className={styles.drawerInfoItem}>
                <User size={15} />
                <div>
                  <label>Name</label>
                  <p>{booking.user?.name || "N/A"}</p>
                </div>
              </div>
              <div className={styles.drawerInfoItem}>
                <Mail size={15} />
                <div>
                  <label>Email</label>
                  <p>{booking.user?.email || "N/A"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Room Information */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Room Information</h3>
            <div className={styles.drawerInfoGrid}>
              <div className={styles.drawerInfoItem}>
                <DoorOpen size={15} />
                <div>
                  <label>Room / Villa</label>
                  <p>{booking.room?.name || "—"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Booking Information */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Booking Information</h3>
            <div className={styles.drawerInfoGrid}>
              <div className={styles.drawerInfoItem}>
                <Hash size={15} />
                <div>
                  <label>Booking ID</label>
                  <p className={styles.mono}>{booking._id}</p>
                </div>
              </div>
              <div className={styles.drawerInfoItem}>
                <CalendarDays size={15} />
                <div>
                  <label>Check-In</label>
                  <p>{new Date(booking.checkIn).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
              </div>
              <div className={styles.drawerInfoItem}>
                <CalendarDays size={15} />
                <div>
                  <label>Check-Out</label>
                  <p>{new Date(booking.checkOut).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
              </div>
              <div className={styles.drawerInfoItem}>
                <Users size={15} />
                <div>
                  <label>Guests</label>
                  <p>{booking.guests ?? 1}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Information */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Payment</h3>
            <div className={styles.drawerInfoGrid}>
              <div className={styles.drawerInfoItem}>
                <CreditCard size={15} />
                <div>
                  <label>Payment Status</label>
                  <p><PaymentChip status={booking.paymentStatus} /></p>
                </div>
              </div>
              {booking.paymentId && (
                <div className={styles.drawerInfoItem}>
                  <Hash size={15} />
                  <div>
                    <label>Payment ID</label>
                    <p className={styles.mono}>{booking.paymentId}</p>
                  </div>
                </div>
              )}
              {booking.paidAt && (
                <div className={styles.drawerInfoItem}>
                  <CalendarDays size={15} />
                  <div>
                    <label>Paid At</label>
                    <p>{new Date(booking.paidAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.drawerTotal}>
              <span>Total Amount</span>
              <strong><IndianRupee size={14} />{(booking.totalPrice || 0).toLocaleString()}</strong>
            </div>
          </section>

          {/* Update Status (TODO) */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Update Status</h3>
            <p className={styles.drawerNote}>
              {/* TODO: Implement PUT /api/bookings/:id to enable status updates */}
              Status updates are not yet available. This will be enabled once the backend supports it.
            </p>
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
    <h3>Failed to load bookings</h3>
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

// ─── BookingsPage (Main) ────────────────────────────────────
const BookingsPage = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState("table");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Drawer
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ─── Fetch Bookings ────────────────────────────────────────
  const fetchBookings = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await axios.get(BOOKINGS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.bookings || res.data.data || [];
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchBookings();
  }, [token, fetchBookings]);

  // ─── Filtered & Sorted ─────────────────────────────────────
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b._id?.toLowerCase().includes(q) ||
          b.user?.name?.toLowerCase().includes(q) ||
          b.room?.name?.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => getBookingStatus(b) === statusFilter);
    }

    if (paymentFilter !== "all") {
      result = result.filter((b) => b.paymentStatus === paymentFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "checkin":
          return new Date(a.checkIn || 0) - new Date(b.checkIn || 0);
        case "amount-high":
          return (b.totalPrice || 0) - (a.totalPrice || 0);
        case "amount-low":
          return (a.totalPrice || 0) - (b.totalPrice || 0);
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return result;
  }, [bookings, search, statusFilter, paymentFilter, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setSortBy("newest");
  };

  return (
    <div className={styles.bookingsPage}>
      <BookingsHeader
        onRefresh={() => fetchBookings(true)}
        refreshing={refreshing}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <BookingKPICards bookings={bookings} />

      <BookingsFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={setPaymentFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={resetFilters}
        resultCount={filteredBookings.length}
      />

      {error ? (
        <ErrorState message={error} onRetry={fetchBookings} />
      ) : viewMode === "calendar" ? (
        <CalendarView bookings={filteredBookings} />
      ) : (
        <BookingsTable
          bookings={filteredBookings}
          onViewDetails={(booking) => setSelectedBooking(booking)}
          loading={loading}
        />
      )}

      <AnimatePresence>
        {selectedBooking && (
          <BookingDrawer
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingsPage;
