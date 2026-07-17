// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   RefreshCw,
//   Plus,
//   Search,
//   X,
//   SlidersHorizontal,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Trash2,
//   MapPin,
//   CheckCircle,
//   XCircle,
//   Clock,
//   ArrowLeft,
//   AlertCircle,
//   Hash,
//   Globe,
//   MapPinned,
//   CalendarDays,
// } from "lucide-react";
// import { useAuth } from "../../../Store/useContext";
// import { PINCODE_ENDPOINTS } from "../../../urls";
// import styles from "./PincodePage.module.css";

const PincodeKPICards = ({ pincodes }) => {
  const counts = useMemo(() => {
    const raw = pincodes || [];
    const states = new Set(raw.map((p) => p.state).filter(Boolean));
    const districts = new Set(raw.map((p) => p.district).filter(Boolean));
    const today = new Date().toDateString();
    const todayAdded = raw.filter((p) => {
      if (!p.createdAt) return false;
      return new Date(p.createdAt).toDateString() === today;
    });
    return {
      total: raw.length,
      states: states.size,
      districts: districts.size,
      todayAdded: todayAdded.length,
    };
  }, [pincodes]);

  const KPI_CARDS = [
    { key: "total", label: "Blocked Pincodes", icon: MapPin, color: "#609966" },
    { key: "states", label: "Unique States", icon: Globe, color: "#2563eb" },
    { key: "districts", label: "Unique Districts", icon: MapPinned, color: "#d97706" },
    { key: "todayAdded", label: "Today's Additions", icon: Clock, color: "#40513B" },
  ];

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

const PincodeChecker = () => {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (!/^\d{6}$/.test(pin)) return;
    setChecking(true);
    setStatus(null);
    setResult(null);
    try {
      const res = await axios.get(PINCODE_ENDPOINTS.CHECK(pin));
      const data = res.data;
      if (data.success) {
        setStatus("available");
        setResult({ district: data.data?.district, state: data.data?.state });
      } else {
        setStatus("blocked");
        setResult({ message: data.message || "Delivery not available" });
      }
    } catch {
      setStatus("error");
      setResult({ message: "Unable to verify pincode" });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className={styles.checkerCard}>
      <div className={styles.checkerHeader}>
        <h3 className={styles.checkerTitle}>Quick Pincode Check</h3>
        <p className={styles.checkerDesc}>Verify if delivery is available for a pincode.</p>
      </div>
      <div className={styles.checkerBody}>
        <div className={styles.checkerInputRow}>
          <div className={styles.checkerInputWrap}>
            <Hash size={16} />
            <input
              type="text"
              placeholder="Enter 6-digit pincode"
              value={pin}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                setPin(v);
                setStatus(null);
                setResult(null);
              }}
              onKeyDown={(e) => { if (e.key === "Enter") handleCheck(); }}
              maxLength={6}
            />
          </div>
          <motion.button
            className={styles.checkerBtn}
            onClick={handleCheck}
            disabled={checking || pin.length !== 6}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {checking ? "Checking..." : "Check"}
          </motion.button>
        </div>
        {status && (
          <motion.div
            className={`${styles.checkerResult} ${styles[`checkerResult_${status}`]}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {status === "available" ? (
              <>
                <CheckCircle size={20} />
                <div>
                  <strong>Delivery Available</strong>
                  {result?.district && <span>{result.district}, {result.state}</span>}
                </div>
              </>
            ) : status === "blocked" ? (
              <>
                <XCircle size={20} />
                <div>
                  <strong>Delivery Blocked</strong>
                  {result?.message && <span>{result.message}</span>}
                </div>
              </>
            ) : (
              <>
                <AlertCircle size={20} />
                <div>
                  <strong>Verification Failed</strong>
                  <span>{result?.message || "Unable to verify"}</span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const PincodeHeader = ({ onRefresh, refreshing, onAddPincode }) => (
  <motion.div
    className={styles.pageHeader}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <div>
      <h1 className={styles.pageTitle}>Pincode Service</h1>
      <p className={styles.pageSubtitle}>Manage blocked delivery locations and verify service availability.</p>
    </div>
    <div className={styles.headerActions}>
      <motion.button
        className={`${styles.headerBtn} ${styles.addBtn}`}
        onClick={onAddPincode}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <Plus size={16} />
        <span>Add Pincode</span>
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

const PincodeFilters = ({
  search,
  onSearchChange,
  stateFilter,
  onStateFilterChange,
  sortBy,
  onSortChange,
  onReset,
  resultCount,
  states,
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
            placeholder="Search by pincode, district or state..."
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

        <div className={styles.resultCount}>{resultCount} locations</div>
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
                <label>State</label>
                <select value={stateFilter} onChange={(e) => onStateFilterChange(e.target.value)}>
                  <option value="all">All States</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Sort By</label>
                <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="pincode">Pincode</option>
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

const ITEMS_PER_PAGE = 15;

const PincodeTable = ({ pincodes, onDelete, loading }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(pincodes.length / ITEMS_PER_PAGE));
  const paginated = pincodes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [pincodes.length, page, totalPages]);

  if (loading) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.tableSkeleton}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skelBox} style={{ width: "10%" }} />
              <div className={styles.skelBox} style={{ width: "20%" }} />
              <div className={styles.skelBox} style={{ width: "18%" }} />
              <div className={styles.skelBox} style={{ width: "25%" }} />
              <div className={styles.skelBox} style={{ width: "15%" }} />
              <div className={styles.skelBox} style={{ width: "8%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pincodes.length === 0) {
    return (
      <motion.div
        className={styles.emptyState}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.emptyIcon}>
          <MapPin size={48} />
        </div>
        <h3 className={styles.emptyTitle}>No Blocked Pincodes Found</h3>
        <p className={styles.emptyText}>No blocked locations match your current filters. Try adjusting your search or filter criteria.</p>
      </motion.div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableInfo}>
        <span className={styles.tableInfoText}>
          Showing <strong>{(page - 1) * ITEMS_PER_PAGE + 1}</strong>–<strong>{Math.min(page * ITEMS_PER_PAGE, pincodes.length)}</strong> of <strong>{pincodes.length}</strong> locations
        </span>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.pincodeTable}>
          <thead>
            <tr>
              <th>Pincode</th>
              <th>District</th>
              <th>State</th>
              <th>Reason</th>
              <th>Created</th>
              <th className={styles.colCenter}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item) => (
              <tr key={item._id} className={styles.tableRow}>
                <td>
                  <span className={styles.pincodeBadge}>{item.pincode}</span>
                </td>
                <td>
                  <span className={styles.cellDistrict}>{item.district || "—"}</span>
                </td>
                <td>
                  <span className={styles.cellState}>{item.state || "—"}</span>
                </td>
                <td>
                  <span className={styles.cellReason}>{item.reason || "—"}</span>
                </td>
                <td>
                  <span className={styles.cellDate}>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </span>
                </td>
                <td className={styles.colCenter}>
                  <div className={styles.cellActions}>
                    <motion.button
                      className={`${styles.actionBtn} ${styles.actionDanger}`}
                      onClick={() => onDelete(item)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete"
                    >
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

const INITIAL_FORM = { pincode: "", district: "", state: "", reason: "" };

const AddPincodeModal = ({ onClose, onSubmit, submitting }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pincode") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 6) return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }
    onSubmit(form);
  };

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
            <h2 className={styles.modalTitle}>Add Blocked Pincode</h2>
            <p className={styles.modalSub}>Restrict delivery service for a specific location.</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 123456"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>District *</label>
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="e.g. Jaipur"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="e.g. Rajasthan"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Reason *</label>
                <input
                  type="text"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="e.g. Out of delivery range"
                  required
                />
              </div>
            </div>

            {error && <div className={styles.formError}>{error}</div>}
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
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {submitting ? "Adding..." : "Add Pincode"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const DeletePincodeDialog = ({ item, onClose, onConfirm, deleting }) => {
  if (!item) return null;

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
        <h3 className={styles.deleteTitle}>Delete Pincode</h3>
        <p className={styles.deleteText}>
          Are you sure you want to remove this blocked pincode? This action cannot be undone.
        </p>
        <div className={styles.pincodePreview}>
          <div className={styles.previewRow}>
            <span className={styles.previewLabel}>Pincode</span>
            <span className={styles.previewValue}>{item.pincode}</span>
          </div>
          <div className={styles.previewRow}>
            <span className={styles.previewLabel}>District</span>
            <span className={styles.previewValue}>{item.district || "—"}</span>
          </div>
          <div className={styles.previewRow}>
            <span className={styles.previewLabel}>State</span>
            <span className={styles.previewValue}>{item.state || "—"}</span>
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
            onClick={() => onConfirm(item._id)}
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
    <h3>Failed to load pincodes</h3>
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

const PincodePage = () => {
  const { token } = useAuth();
  const [pincodes, setPincodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const fetchPincodes = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await axios.get(PINCODE_ENDPOINTS.BLOCKED, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data || res.data.pincodes || res.data || [];
      setPincodes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to fetch pincodes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchPincodes();
  }, [token, fetchPincodes]);

  const handleAddPincode = async (formData) => {
    try {
      setSubmitting(true);
      await axios.post(PINCODE_ENDPOINTS.ADD, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddModal(false);
      await fetchPincodes();
    } catch (err) {
      console.error("Add pincode failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePincode = async (id) => {
    try {
      setDeleting(true);
      await axios.delete(PINCODE_ENDPOINTS.DELETE(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteItem(null);
      setPincodes((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const states = useMemo(() => {
    const s = new Set(pincodes.map((p) => p.state).filter(Boolean));
    return Array.from(s).sort();
  }, [pincodes]);

  const filteredPincodes = useMemo(() => {
    let result = [...pincodes];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.pincode || "").includes(q) ||
          (p.district || "").toLowerCase().includes(q) ||
          (p.state || "").toLowerCase().includes(q),
      );
    }

    if (stateFilter !== "all") {
      result = result.filter((p) => p.state === stateFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "pincode":
          return (a.pincode || "").localeCompare(b.pincode || "");
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return result;
  }, [pincodes, search, stateFilter, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setStateFilter("all");
    setSortBy("newest");
  };

  return (
    <div className={styles.pincodePage}>
      <PincodeHeader
        onRefresh={() => fetchPincodes(true)}
        refreshing={refreshing}
        onAddPincode={() => setShowAddModal(true)}
      />

      <PincodeKPICards pincodes={pincodes} />

      <PincodeChecker />

      <PincodeFilters
        search={search}
        onSearchChange={setSearch}
        stateFilter={stateFilter}
        onStateFilterChange={setStateFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={resetFilters}
        resultCount={filteredPincodes.length}
        states={states}
      />

      {error ? (
        <ErrorState message={error} onRetry={fetchPincodes} />
      ) : (
        <PincodeTable
          pincodes={filteredPincodes}
          onDelete={(item) => setDeleteItem(item)}
          loading={loading}
        />
      )}

      <AnimatePresence>
        {showAddModal && (
          <AddPincodeModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddPincode}
            submitting={submitting}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteItem && (
          <DeletePincodeDialog
            item={deleteItem}
            onClose={() => setDeleteItem(null)}
            onConfirm={handleDeletePincode}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PincodePage;
