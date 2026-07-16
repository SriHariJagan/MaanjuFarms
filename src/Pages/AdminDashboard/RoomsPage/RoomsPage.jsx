import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Plus,
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Trash2,
  Building2,
  ClipboardList,
  IndianRupee,
  CalendarDays,
  ArrowLeft,
  AlertCircle,
  Home,
  DoorOpen,
  MapPin,
  BedDouble,
  Hash,
  Image as ImageIcon,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Grid3X3,
  Table2,
} from "lucide-react";
import { useAuth } from "../../../Store/useContext";
import { ROOMS_ENDPOINTS, IMAGE_BASE } from "../../../urls";
import { getImageUrl } from "../../../utils/getImageUrl ";
import styles from "./RoomsPage.module.css";

const ROOM_STATUS = {
  Available: { bg: "rgba(96,153,102,0.12)", text: "#609966" },
  Booked: { bg: "rgba(59,130,246,0.1)", text: "#2563eb" },
  Blocked: { bg: "rgba(239,68,68,0.1)", text: "#ef4444" },
  Maintenance: { bg: "rgba(245,158,11,0.1)", text: "#d97706" },
};

const getRoomStatus = (room) => {
  if (room.isBlocked) return "Blocked";
  if (room.status === "Booked") return "Booked";
  if (room.status === "Maintenance") return "Maintenance";
  return "Available";
};

const RoomStatusBadge = ({ room }) => {
  const status = getRoomStatus(room);
  const config = ROOM_STATUS[status] || ROOM_STATUS.Available;
  return (
    <span className={styles.statusBadge} style={{ background: config.bg, color: config.text }}>
      <span className={styles.statusDot} style={{ background: config.text }} />
      {status}
    </span>
  );
};

const KPI_CARDS = [
  { key: "total", label: "Total Rooms", icon: Building2, color: "#609966" },
  { key: "available", label: "Available", icon: CheckCircle, color: "#40513B" },
  { key: "booked", label: "Booked", icon: BedDouble, color: "#2563eb" },
  { key: "blocked", label: "Blocked", icon: XCircle, color: "#ef4444" },
  { key: "categories", label: "Categories", icon: MapPin, color: "#d97706" },
];

const RoomKPICards = ({ rooms }) => {
  const counts = useMemo(() => {
    const raw = rooms || [];
    const cats = new Set(raw.map((r) => r.category).filter(Boolean));
    return {
      total: raw.length,
      available: raw.filter((r) => getRoomStatus(r) === "Available").length,
      booked: raw.filter((r) => getRoomStatus(r) === "Booked").length,
      blocked: raw.filter((r) => getRoomStatus(r) === "Blocked").length,
      categories: cats.size,
    };
  }, [rooms]);

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

const RoomImage = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  const url = getImageUrl(src);
  if (!url || error) {
    return (
      <div className={`${styles.roomImgPlaceholder} ${className || ""}`}>
        <BedDouble size={20} />
      </div>
    );
  }
  return <img src={url} alt={alt || "Room"} className={className || ""} onError={() => setError(true)} />;
};

const RoomsHeader = ({ onRefresh, refreshing, onAddRoom, viewMode, onViewModeChange }) => (
  <motion.div
    className={styles.pageHeader}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <div>
      <h1 className={styles.pageTitle}>Rooms</h1>
      <p className={styles.pageSubtitle}>Manage villas, cottages and room availability.</p>
    </div>
    <div className={styles.headerActions}>
      <div className={styles.viewToggle}>
        <motion.button
          className={`${styles.viewToggleBtn} ${viewMode === "grid" ? styles.viewToggleActive : ""}`}
          onClick={() => onViewModeChange("grid")}
          whileTap={{ scale: 0.95 }}
        >
          <Grid3X3 size={14} />
          Grid
        </motion.button>
        <motion.button
          className={`${styles.viewToggleBtn} ${viewMode === "table" ? styles.viewToggleActive : ""}`}
          onClick={() => onViewModeChange("table")}
          whileTap={{ scale: 0.95 }}
        >
          <Table2 size={14} />
          Table
        </motion.button>
      </div>
      <motion.button
        className={`${styles.headerBtn} ${styles.addBtn}`}
        onClick={onAddRoom}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <Plus size={16} />
        <span>Add Room</span>
      </motion.button>
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

const RoomsFilters = ({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  typeFilter,
  onTypeFilterChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  sortBy,
  onSortChange,
  onReset,
  resultCount,
  categories,
  types,
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
            placeholder="Search by room name, category or type..."
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

        <div className={styles.resultCount}>{resultCount} rooms</div>
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
                <label>Category</label>
                <select value={categoryFilter} onChange={(e) => onCategoryFilterChange(e.target.value)}>
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Type</label>
                <select value={typeFilter} onChange={(e) => onTypeFilterChange(e.target.value)}>
                  <option value="all">All Types</option>
                  {types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Availability</label>
                <select value={availabilityFilter} onChange={(e) => onAvailabilityFilterChange(e.target.value)}>
                  <option value="all">All</option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="blocked">Blocked</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Sort By</label>
                <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
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

const ITEMS_PER_PAGE = 12;

const RoomsGrid = ({ rooms, onViewDetails, onEdit, onDelete, loading }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rooms.length / ITEMS_PER_PAGE));
  const paginated = rooms.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [rooms.length, page, totalPages]);

  if (loading) {
    return (
      <div className={styles.gridWrapper}>
        <div className={styles.roomGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skelImage} />
              <div className={styles.skelBody}>
                <div className={styles.skelBox} style={{ width: "70%", height: 14 }} />
                <div className={styles.skelBox} style={{ width: "40%", height: 12 }} />
                <div className={styles.skelRow}>
                  <div className={styles.skelBox} style={{ width: "30%", height: 14 }} />
                  <div className={styles.skelBox} style={{ width: "25%", height: 20, borderRadius: 100 }} />
                </div>
                <div className={styles.skelActions}>
                  <div className={styles.skelBox} style={{ width: 28, height: 28, borderRadius: 8 }} />
                  <div className={styles.skelBox} style={{ width: 28, height: 28, borderRadius: 8 }} />
                  <div className={styles.skelBox} style={{ width: 28, height: 28, borderRadius: 8 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
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
        <h3 className={styles.emptyTitle}>No Rooms Available</h3>
        <p className={styles.emptyText}>No rooms match your current filters. Try adjusting your search or filter criteria.</p>
      </motion.div>
    );
  }

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.gridInfo}>
        <span className={styles.gridInfoText}>
          Showing <strong>{(page - 1) * ITEMS_PER_PAGE + 1}</strong>–<strong>{Math.min(page * ITEMS_PER_PAGE, rooms.length)}</strong> of <strong>{rooms.length}</strong> rooms
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div className={styles.roomGrid}>
          {paginated.map((room) => (
            <motion.div
              key={room._id}
              className={styles.roomCard}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(64,81,59,0.12)" }}
            >
              <div className={styles.cardImageWrap}>
                <RoomImage src={room.image} alt={room.name} className={styles.cardImage} />
                <div className={styles.cardBadge}>
                  <RoomStatusBadge room={room} />
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardType}>
                  <Home size={11} />
                  {room.type || room.category || "Standard"}
                </div>

                <h3 className={styles.cardName}>{room.name}</h3>

                <div className={styles.cardMeta}>
                  <span className={styles.cardPrice}>
                    <IndianRupee size={12} />
                    {(room.price || 0).toLocaleString()}
                    <span className={styles.cardPerNight}>/night</span>
                  </span>
                </div>

                <div className={styles.cardCategory}>
                  <MapPin size={11} />
                  {room.category || "Uncategorized"}
                </div>

                <div className={styles.cardActions}>
                  <motion.button
                    className={styles.cardActionBtn}
                    onClick={() => onViewDetails(room)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    title="View Details"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </motion.button>
                  <motion.button
                    className={styles.cardActionBtn}
                    onClick={() => onEdit(room)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    title="Edit Room"
                  >
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </motion.button>
                  <motion.button
                    className={`${styles.cardActionBtn} ${styles.cardActionDanger}`}
                    onClick={() => onDelete(room)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    title="Delete Room"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

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

const RoomsTable = ({ rooms, onViewDetails, onEdit, onDelete, loading }) => {
  const [page, setPage] = useState(1);
  const perPage = 15;
  const totalPages = Math.max(1, Math.ceil(rooms.length / perPage));
  const paginated = rooms.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [rooms.length, page, totalPages]);

  if (loading) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.tableSkeleton}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skelBox} style={{ width: "8%" }} />
              <div className={styles.skelBox} style={{ width: "20%" }} />
              <div className={styles.skelBox} style={{ width: "14%" }} />
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "12%" }} />
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "8%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
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
        <h3 className={styles.emptyTitle}>No Rooms Found</h3>
        <p className={styles.emptyText}>No rooms match your current filters. Try adjusting your search or filter criteria.</p>
      </motion.div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableInfo}>
        <span className={styles.tableInfoText}>
          Showing <strong>{(page - 1) * perPage + 1}</strong>–<strong>{Math.min(page * perPage, rooms.length)}</strong> of <strong>{rooms.length}</strong> rooms
        </span>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.roomsTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Room Name</th>
              <th>Category</th>
              <th>Type</th>
              <th className={styles.colRight}>Price</th>
              <th className={styles.colCenter}>Status</th>
              <th className={styles.colCenter}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((room) => (
              <tr key={room._id} className={styles.tableRow}>
                <td>
                  <div className={styles.tableImageWrap}>
                    <RoomImage src={room.image} alt={room.name} className={styles.tableImage} />
                  </div>
                </td>
                <td>
                  <span className={styles.cellName}>{room.name}</span>
                </td>
                <td>
                  <span className={styles.cellCategory}>{room.category || "—"}</span>
                </td>
                <td>
                  <span className={styles.cellType}>{room.type || "—"}</span>
                </td>
                <td className={styles.colRight}>
                  <span className={styles.cellAmount}>
                    <IndianRupee size={12} />
                    {(room.price || 0).toLocaleString()}
                  </span>
                </td>
                <td className={styles.colCenter}>
                  <RoomStatusBadge room={room} />
                </td>
                <td className={styles.colCenter}>
                  <div className={styles.cellActions}>
                    <motion.button className={styles.actionBtn} onClick={() => onViewDetails(room)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="View">
                      <Eye size={15} />
                    </motion.button>
                    <motion.button className={styles.actionBtn} onClick={() => onEdit(room)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Edit">
                      <Edit3 size={15} />
                    </motion.button>
                    <motion.button className={styles.actionBtn} onClick={() => onDelete(room)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Delete">
                      <Trash2 size={15} />
                    </motion.button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Page {page} of {totalPages}
          </div>
          <div className={styles.paginationControls}>
            <motion.button className={styles.pageBtn} onClick={() => setPage(1)} disabled={page === 1} whileTap={{ scale: 0.95 }} title="First">
              <span className={styles.pageBtnIcon}>{`\u00ab`}</span>
            </motion.button>
            <motion.button className={styles.pageBtn} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} whileTap={{ scale: 0.95 }} title="Previous">
              <ChevronLeft size={15} />
            </motion.button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className={styles.pageEllipsis}>...</span>}
                    <motion.button className={`${styles.pageBtn} ${styles.pageNum} ${p === page ? styles.pageBtnActive : ""}`} onClick={() => setPage(p)} whileTap={{ scale: 0.95 }}>
                      {p}
                    </motion.button>
                  </React.Fragment>
                ))}
            </div>
            <motion.button className={styles.pageBtn} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} whileTap={{ scale: 0.95 }} title="Next">
              <ChevronRight size={15} />
            </motion.button>
            <motion.button className={styles.pageBtn} onClick={() => setPage(totalPages)} disabled={page === totalPages} whileTap={{ scale: 0.95 }} title="Last">
              <span className={styles.pageBtnIcon}>{`\u00bb`}</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

const RoomTimeline = ({ room }) => {
  const steps = [
    { key: "created", label: "Room Created", date: room.createdAt },
  ];
  if (room.updatedAt && room.updatedAt !== room.createdAt) {
    steps.push({ key: "updated", label: "Last Updated", date: room.updatedAt });
  }

  return (
    <div className={styles.timeline}>
      {steps.map((step, idx) => (
        <div key={step.key} className={`${styles.timelineStep} ${styles.timelineActive}`}>
          <div className={styles.timelineDot}>
            <Clock size={12} />
          </div>
          <div className={styles.timelineContent}>
            <span className={styles.timelineLabel}>{step.label}</span>
            {step.date && <span className={styles.timelineDate}>{new Date(step.date).toLocaleString()}</span>}
          </div>
          {idx < steps.length - 1 && <div className={`${styles.timelineLine} ${styles.timelineLineActive}`} />}
        </div>
      ))}
    </div>
  );
};

const RoomAvailabilityCard = ({ room }) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!room?._id) return;
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await axios.get(ROOMS_ENDPOINTS.AVAILABILITY(room._id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailability(res.data);
      } catch {
        /* silently fail — availability endpoint may not exist */
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [room?._id, token]);

  const status = getRoomStatus(room);

  return (
    <div className={styles.availabilityCard}>
      <div className={styles.availabilityHeader}>
        <h4 className={styles.availabilityTitle}>Check Availability</h4>
      </div>
      <div className={styles.availabilityBody}>
        <div className={styles.availabilityItem}>
          <span className={styles.availabilityLabel}>Current Status</span>
          <div className={styles.availabilityValue}>
            <RoomStatusBadge room={room} />
          </div>
        </div>
        {room.isBlocked && room.blockedUntil && (
          <div className={styles.availabilityItem}>
            <span className={styles.availabilityLabel}>Blocked Until</span>
            <span className={styles.availabilityValue}>{new Date(room.blockedUntil).toLocaleDateString()}</span>
          </div>
        )}
        {loading ? (
          <div className={styles.availabilityLoading}>
            <div className={styles.skelBox} style={{ width: "100%", height: 14 }} />
          </div>
        ) : availability ? (
          <>
            <div className={styles.availabilityItem}>
              <span className={styles.availabilityLabel}>Available</span>
              <span className={styles.availabilityValue}>
                {availability.isAvailable !== undefined
                  ? (availability.isAvailable ? "Yes" : "No")
                  : status === "Available" ? "Yes" : "No"}
              </span>
            </div>
            {availability.bookedDates?.length > 0 && (
              <div className={styles.availabilityItem}>
                <span className={styles.availabilityLabel}>Booked Dates</span>
                <div className={styles.availabilityDates}>
                  {availability.bookedDates.slice(0, 5).map((d) => (
                    <span key={d} className={styles.availabilityDateChip}>
                      {new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  ))}
                  {availability.bookedDates.length > 5 && (
                    <span className={styles.availabilityDateMore}>+{availability.bookedDates.length - 5} more</span>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.availabilityFallback}>
            <p>Availability endpoint not available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const RoomDrawer = ({ room, onClose }) => {
  if (!room) return null;

  const status = getRoomStatus(room);

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
            <h2 className={styles.drawerTitle}>{room.name || "Room Details"}</h2>
            <span className={styles.drawerSub}>{room.type || room.category || "Room"}</span>
          </div>
          <RoomStatusBadge room={room} />
        </div>

        <div className={styles.drawerBody}>
          {/* Room Image */}
          <section className={styles.drawerSection}>
            <div className={styles.drawerImageWrap}>
              <RoomImage src={room.image} alt={room.name} className={styles.drawerImage} />
            </div>
          </section>

          {/* Room Information */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Room Information</h3>
            <div className={styles.drawerInfoGrid}>
              <div className={styles.drawerInfoItem}>
                <Hash size={15} />
                <div>
                  <label>Room ID</label>
                  <p className={styles.mono}>{room._id}</p>
                </div>
              </div>
              <div className={styles.drawerInfoItem}>
                <Building2 size={15} />
                <div>
                  <label>Name</label>
                  <p>{room.name}</p>
                </div>
              </div>
              <div className={styles.drawerInfoItem}>
                <MapPin size={15} />
                <div>
                  <label>Category</label>
                  <p>{room.category || "—"}</p>
                </div>
              </div>
              <div className={styles.drawerInfoItem}>
                <Home size={15} />
                <div>
                  <label>Type</label>
                  <p>{room.type || "—"}</p>
                </div>
              </div>
              <div className={styles.drawerInfoItem}>
                <IndianRupee size={15} />
                <div>
                  <label>Price</label>
                  <p>₹{(room.price || 0).toLocaleString()} / night</p>
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          {room.description && (
            <section className={styles.drawerSection}>
              <h3 className={styles.drawerSectionTitle}>Description</h3>
              <p className={styles.drawerDescription}>{room.description}</p>
            </section>
          )}

          {/* Availability */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Availability</h3>
            <div className={styles.drawerInfoGrid}>
              <div className={styles.drawerInfoItem}>
                <DoorOpen size={15} />
                <div>
                  <label>Status</label>
                  <p><RoomStatusBadge room={room} /></p>
                </div>
              </div>
              {room.isBlocked && (
                <>
                  <div className={styles.drawerInfoItem}>
                    <XCircle size={15} />
                    <div>
                      <label>Blocked</label>
                      <p>Yes</p>
                    </div>
                  </div>
                  {room.blockedUntil && (
                    <div className={styles.drawerInfoItem}>
                      <CalendarDays size={15} />
                      <div>
                        <label>Blocked Until</label>
                        <p>{new Date(room.blockedUntil).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <RoomAvailabilityCard room={room} />
          </section>

          {/* Gallery */}
          {room.images?.length > 0 && (
            <section className={styles.drawerSection}>
              <h3 className={styles.drawerSectionTitle}>Gallery</h3>
              <div className={styles.galleryGrid}>
                {room.images.map((img, idx) => (
                  <div key={idx} className={styles.galleryItem}>
                    <img src={getImageUrl(img)} alt={`${room.name} ${idx + 1}`} className={styles.galleryImage} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Timeline */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Timeline</h3>
            <RoomTimeline room={room} />
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};

const INITIAL_FORM = { name: "", category: "", type: "", price: "", description: "" };

const RoomModal = ({ room, onClose, onSubmit, submitting }) => {
  const isEdit = !!room;
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (room) {
      setForm({
        name: room.name || "",
        category: room.category || "",
        type: room.type || "",
        price: room.price?.toString() || "",
        description: room.description || "",
      });
      if (room.image) setImagePreview(getImageUrl(room.image));
    } else {
      setForm(INITIAL_FORM);
      setImageFile(null);
      setImagePreview(null);
    }
  }, [room]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("type", form.type);
    formData.append("price", form.price);
    formData.append("description", form.description);
    if (imageFile) formData.append("image", imageFile);
    onSubmit(formData, isEdit);
  };

  const dirty = form.name !== (room?.name || "")
    || form.category !== (room?.category || "")
    || form.type !== (room?.type || "")
    || form.price !== (room?.price?.toString() || "")
    || form.description !== (room?.description || "")
    || !!imageFile;

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>{isEdit ? "Edit Room" : "Add Room"}</h2>
            <p className={styles.modalSub}>{isEdit ? "Update room details." : "Add a new room to the property."}</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Room Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Premium Villa"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category *</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Villa"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Type</label>
                <input
                  type="text"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="e.g. Deluxe"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Room description..."
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Room Image</label>
              <div className={styles.imageUploadArea}>
                {imagePreview ? (
                  <div className={styles.imagePreviewWrap}>
                    <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                    <button
                      type="button"
                      className={styles.imageRemove}
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className={styles.imageUploadLabel}>
                    <Upload size={20} />
                    <span>Click to upload image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <motion.button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting || !form.name || !form.price || !dirty}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {submitting ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Room" : "Add Room")}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const DeleteRoomDialog = ({ room, onClose, onConfirm, deleting }) => {
  if (!room) return null;

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.deleteDialog}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.deleteIconWrap}>
          <Trash2 size={28} />
        </div>
        <h3 className={styles.deleteTitle}>Delete Room</h3>
        <p className={styles.deleteText}>
          Are you sure you want to delete <strong>{room.name}</strong>? This action cannot be undone.
        </p>
        <div className={styles.roomPreview}>
          <div className={styles.roomPreviewImage}>
            <RoomImage src={room.image} alt={room.name} />
          </div>
          <div className={styles.roomPreviewInfo}>
            <span className={styles.roomPreviewName}>{room.name}</span>
            <span className={styles.roomPreviewMeta}>{room.category || room.type || "Room"}</span>
          </div>
        </div>
        <div className={styles.deleteActions}>
          <motion.button
            className={styles.cancelBtn}
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Cancel
          </motion.button>
          <motion.button
            className={styles.deleteBtn}
            onClick={() => onConfirm(room._id)}
            disabled={deleting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ErrorState = ({ message, onRetry }) => (
  <motion.div
    className={styles.errorState}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <AlertCircle size={48} />
    <h3>Failed to load rooms</h3>
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

const RoomsPage = () => {
  const { token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editRoom, setEditRoom] = useState(null);
  const [deleteRoom, setDeleteRoom] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchRooms = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await axios.get(ROOMS_ENDPOINTS.ALL);
      const data = Array.isArray(res.data) ? res.data : res.data.rooms || res.data.data || [];
      setRooms(data);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleSubmitRoom = async (formData, isEdit) => {
    try {
      setSubmitting(true);
      if (isEdit && editRoom) {
        await axios.put(ROOMS_ENDPOINTS.UPDATE(editRoom._id), formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(ROOMS_ENDPOINTS.ADD, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }
      setShowAddModal(false);
      setEditRoom(null);
      await fetchRooms();
    } catch (err) {
      console.error("Room submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      setDeleting(true);
      await axios.delete(ROOMS_ENDPOINTS.DELETE(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteRoom(null);
      setRooms((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(rooms.map((r) => r.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [rooms]);

  const types = useMemo(() => {
    const t = new Set(rooms.map((r) => r.type).filter(Boolean));
    return Array.from(t).sort();
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q) ||
          r.type?.toLowerCase().includes(q),
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((r) => r.category === categoryFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((r) => r.type === typeFilter);
    }

    if (availabilityFilter !== "all") {
      result = result.filter((r) => getRoomStatus(r) === availabilityFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "alpha":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return result;
  }, [rooms, search, categoryFilter, typeFilter, availabilityFilter, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setTypeFilter("all");
    setAvailabilityFilter("all");
    setSortBy("newest");
  };

  return (
    <div className={styles.roomsPage}>
      <RoomsHeader
        onRefresh={() => fetchRooms(true)}
        refreshing={refreshing}
        onAddRoom={() => setShowAddModal(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <RoomKPICards rooms={rooms} />

      <RoomsFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        availabilityFilter={availabilityFilter}
        onAvailabilityFilterChange={setAvailabilityFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={resetFilters}
        resultCount={filteredRooms.length}
        categories={categories}
        types={types}
      />

      {error ? (
        <ErrorState message={error} onRetry={fetchRooms} />
      ) : viewMode === "table" ? (
        <RoomsTable
          rooms={filteredRooms}
          onViewDetails={(room) => setSelectedRoom(room)}
          onEdit={(room) => setEditRoom(room)}
          onDelete={(room) => setDeleteRoom(room)}
          loading={loading}
        />
      ) : (
        <RoomsGrid
          rooms={filteredRooms}
          onViewDetails={(room) => setSelectedRoom(room)}
          onEdit={(room) => setEditRoom(room)}
          onDelete={(room) => setDeleteRoom(room)}
          loading={loading}
        />
      )}

      <AnimatePresence>
        {selectedRoom && (
          <RoomDrawer room={selectedRoom} onClose={() => setSelectedRoom(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showAddModal || editRoom) && (
          <RoomModal
            room={editRoom}
            onClose={() => { setShowAddModal(false); setEditRoom(null); }}
            onSubmit={handleSubmitRoom}
            submitting={submitting}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteRoom && (
          <DeleteRoomDialog
            room={deleteRoom}
            onClose={() => setDeleteRoom(null)}
            onConfirm={handleDeleteRoom}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomsPage;
