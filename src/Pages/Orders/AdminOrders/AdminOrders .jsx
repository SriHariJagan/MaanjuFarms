import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search, Package, CalendarDays, User, MapPin, Truck, ChevronDown, ChevronUp,
  Phone, Mail, Filter, ArrowUpDown, RefreshCw, Send, X, Loader2, Download,
  AlertTriangle, Clock
} from "lucide-react";
import styles from "./AdminOrders.module.css";
import { ORDERS_API } from "../../../urls";
import StatusBadge from "../../../Components/orders/StatusBadge";
import OrderStats from "../../../Components/orders/OrderStats";
import OrderTimeline from "../../../Components/orders/OrderTimeline";
import DeliveryForm from "../../../Components/orders/DeliveryForm";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const slideDown = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  exit: { opacity: 0, height: 0 },
};

const VALID_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "packed", "shipped", "out_for_delivery", "cancelled"],
  processing: ["packed", "shipped", "out_for_delivery", "cancelled"],
  packed: ["shipped", "out_for_delivery", "cancelled"],
  shipped: ["out_for_delivery", "delivered", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [expandedOrders, setExpandedOrders] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [showDeliveryForm, setShowDeliveryForm] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [statusError, setStatusError] = useState("");
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const { data } = await axios.get(ORDERS_API.STATS, { headers });
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.error("Stats fetch error:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({ page, limit: 12, sortBy });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);
      if (dateFilter === "today") {
        const today = new Date().toISOString().split("T")[0];
        params.set("startDate", today);
        params.set("endDate", today);
      }

      const { data } = await axios.get(`${ORDERS_API.ALL}?${params}`, { headers });
      if (data.success) {
        setOrders(data.orders);
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, sortBy, search, dateFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateStatus = async () => {
    if (!showStatusModal || !selectedStatus) return;
    try {
      setActionLoading("status");
      setUpdatingId(showStatusModal);
      setStatusError("");

      const { data } = await axios.put(
        ORDERS_API.UPDATE_STATUS(showStatusModal),
        { status: selectedStatus, notes: statusNotes },
        { headers }
      );

      if (data.success) {
        setOrders((prev) => prev.map((o) => (o._id === showStatusModal ? data.order : o)));
        setShowStatusModal(null);
        setSelectedStatus("");
        setStatusNotes("");
        fetchStats();
      }
    } catch (err) {
      setStatusError(err.response?.data?.msg || "Failed to update status");
    } finally {
      setActionLoading(null);
      setUpdatingId(null);
    }
  };

  const handleDeliverySave = async (deliveryData) => {
    if (!showDeliveryForm) return;
    try {
      setActionLoading("delivery");
      const { data } = await axios.put(
        ORDERS_API.UPDATE_DELIVERY(showDeliveryForm),
        deliveryData,
        { headers }
      );
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o._id === showDeliveryForm ? data.order : o)));
        setShowDeliveryForm(null);
        fetchStats();
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update delivery");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setActionLoading("cancel");
      setUpdatingId(orderId);
      const { data } = await axios.post(
        ORDERS_API.CANCEL(orderId),
        { reason: "Cancelled by admin" },
        { headers }
      );
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
        fetchStats();
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to cancel order");
    } finally {
      setActionLoading(null);
      setUpdatingId(null);
    }
  };

  const handleResendEmail = async (orderId) => {
    try {
      setActionLoading("email");
      await axios.post(ORDERS_API.RESEND_EMAIL(orderId), {}, { headers });
      alert("Email resent successfully");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to resend email");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadInvoice = async (order) => {
    try {
      const { data } = await axios.get(ORDERS_API.INVOICE(order._id), {
        headers, responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${order._id.slice(-8)}.pdf`;
      a.click();
    } catch (err) {
      console.error("Invoice download error:", err);
    }
  };

  const openStatusModal = (order) => {
    setShowStatusModal(order._id);
    setSelectedStatus("");
    setStatusNotes("");
    setStatusError("");
  };

  const getTransitions = (currentStatus) => VALID_TRANSITIONS[currentStatus] || [];

  return (
    <div className={styles.adminOrders}>
      <div className={styles.header}>
        <div>
          <p className={styles.subTitle}>Dashboard / Orders</p>
          <h2>Order Management</h2>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input type="text" placeholder="Search by name, email, or ID..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <button onClick={() => { fetchStats(); fetchOrders(); }} style={{ padding: "10px", border: "1px solid #d1d5db", borderRadius: "10px", background: "#fff", cursor: "pointer", display: "flex" }}>
            <RefreshCw size={18} color="#6b7280" />
          </button>
        </div>
      </div>

      <OrderStats stats={stats} loading={statsLoading} />

      <div className={styles.filtersWrapper}>
        <div className={styles.filterGroup}>
          <Filter size={16} />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <CalendarDays size={16} />
          <select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <ArrowUpDown size={16} />
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="amount-high">Highest Amount</option>
            <option value="amount-low">Lowest Amount</option>
          </select>
        </div>
        <div className={styles.totalOrders}>{pagination.total} Orders</div>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "20px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ padding: "24px", background: "#fff", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "10px", background: "#f3f4f6" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: "16px", width: "60%", borderRadius: "4px", background: "#f3f4f6", marginBottom: "8px" }} />
                  <div style={{ height: "12px", width: "40%", borderRadius: "4px", background: "#f3f4f6" }} />
                </div>
              </div>
              <div style={{ height: "12px", width: "100%", borderRadius: "4px", background: "#f3f4f6", marginBottom: "8px" }} />
              <div style={{ height: "12px", width: "80%", borderRadius: "4px", background: "#f3f4f6" }} />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <Package size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
          <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#6b7280" }}>No orders found</h3>
        </div>
      ) : (
        <>
          <div className={styles.ordersGrid}>
            {orders.map((order) => {
              const isExpanded = expandedOrders[order._id];
              const transitions = getTransitions(order.status);
              return (
                <motion.div className={styles.orderCard} key={order._id} variants={fadeUp} layout>
                  <div className={styles.topSection}>
                    <div className={styles.orderLeft}>
                      <div className={styles.orderIcon}><Package size={26} /></div>
                      <div>
                        <p className={styles.label}>ORDER #{order._id?.slice(-8)}</p>
                        <div className={styles.dateRow}>
                          <CalendarDays size={15} />
                          <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className={styles.section}>
                    <div className={styles.sectionTitle}>Customer Details</div>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoCard}><User size={20} /><div><label>Name</label><p>{order.user?.name || "N/A"}</p></div></div>
                      <div className={styles.infoCard}><Mail size={20} /><div><label>Email</label><p>{order.user?.email || "N/A"}</p></div></div>
                      <div className={styles.infoCard}><Phone size={20} /><div><label>Phone</label><p>{order.deliveryAddress?.phone || "N/A"}</p></div></div>
                    </div>
                  </div>

                  {(order.deliveryAddress?.street || order.deliveryAddress?.city) && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px", background: "#f9fafb", borderRadius: "10px" }}>
                      <MapPin size={18} color="#6b7280" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>
                        {order.deliveryAddress?.name && <strong>{order.deliveryAddress.name}</strong>}
                        {order.deliveryAddress?.street && <>, {order.deliveryAddress.street}</>}
                        {order.deliveryAddress?.city && <>, {order.deliveryAddress.city}</>}
                        {order.deliveryAddress?.district && <>, {order.deliveryAddress.district}</>}
                        {order.deliveryAddress?.state && <>, {order.deliveryAddress.state}</>}
                        {order.deliveryAddress?.pincode && <> - {order.deliveryAddress.pincode}</>}
                      </div>
                    </div>
                  )}

                  <div className={styles.orderDropdown}>
                    <button className={styles.dropdownButton} onClick={() => toggleOrder(order._id)}>
                      <span>Products ({order.products?.length}) & Details</span>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div className={styles.dropdownContent} variants={slideDown} initial="initial" animate="animate" exit="exit">
                          <div className={styles.productsWrapper}>
                            {order.products?.map((item) => (
                              <div className={styles.productCard} key={item._id}>
                                <img src={item.product?.image || item.imageAtOrder || "/placeholder.jpg"} alt="" />
                                <h4>{item.product?.name || item.nameAtOrder || "Product"}</h4>
                                <p>Qty: {item.quantity}</p>
                                <b>₹{((item.product?.price || item.priceAtOrder || 0)).toLocaleString("en-IN")}</b>
                              </div>
                            ))}
                          </div>

                          {order.delivery?.partner && (
                            <div style={{ marginTop: "16px", padding: "12px", background: "#eff6ff", borderRadius: "8px", border: "1px solid #dbeafe" }}>
                              <div style={{ fontSize: "12px", fontWeight: 600, color: "#1e40af", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                <Truck size={14} style={{ display: "inline", marginRight: "6px" }} />Delivery Info
                              </div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px" }}>
                                <div><span style={{ color: "#6b7280" }}>Partner:</span> <strong>{order.delivery.partner}</strong></div>
                                {order.delivery.trackingNumber && (
                                  <div>
                                    <span style={{ color: "#6b7280" }}>Tracking:</span>{" "}
                                    {order.delivery.trackingUrl ? (
                                      <a href={order.delivery.trackingUrl} target="_blank" rel="noreferrer" style={{ color: "#3b82f6" }}>{order.delivery.trackingNumber}</a>
                                    ) : (
                                      <strong>{order.delivery.trackingNumber}</strong>
                                    )}
                                  </div>
                                )}
                                {order.delivery.estimatedDelivery && (
                                  <div><span style={{ color: "#6b7280" }}>Est. Delivery:</span> <strong>{new Date(order.delivery.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</strong></div>
                                )}
                              </div>
                            </div>
                          )}

                          {order.timeline?.length > 0 && (
                            <div style={{ marginTop: "16px" }}>
                              <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className={styles.paymentSection}>
                    <div>
                      <label>Total Amount</label>
                      <h3>₹{(order.totalAmount || 0).toLocaleString("en-IN")}</h3>
                    </div>
                    <div>
                      <label>Payment</label>
                      <span className={`${styles.paymentBadge} ${order.paymentStatus === "paid" ? styles.paid : styles.pendingPayment}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => openStatusModal(order)}
                      disabled={transitions.length === 0}
                      style={{ flex: 1, padding: "10px", border: "1px solid #d1d5db", borderRadius: "8px", background: transitions.length === 0 ? "#f3f4f6" : "#fff", color: transitions.length === 0 ? "#9ca3af" : "#374151", cursor: transitions.length === 0 ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", minWidth: "120px" }}
                    >
                      <Clock size={16} /> Update Status
                    </button>
                    <button
                      onClick={() => setShowDeliveryForm(order._id)}
                      disabled={["delivered", "cancelled"].includes(order.status)}
                      style={{ flex: 1, padding: "10px", border: "1px solid #d1d5db", borderRadius: "8px", background: ["delivered", "cancelled"].includes(order.status) ? "#f3f4f6" : "#fff", color: ["delivered", "cancelled"].includes(order.status) ? "#9ca3af" : "#374151", cursor: ["delivered", "cancelled"].includes(order.status) ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", minWidth: "120px" }}
                    >
                      <Truck size={16} /> Delivery
                    </button>
                    <button
                      onClick={() => handleResendEmail(order._id)}
                      disabled={actionLoading === "email"}
                      style={{ padding: "10px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      title="Resend Email"
                    >
                      <Send size={16} />
                    </button>
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={!transitions.includes("cancelled") || actionLoading === "cancel"}
                      style={{ padding: "10px", border: "1px solid #fecaca", borderRadius: "8px", background: !transitions.includes("cancelled") ? "#f3f4f6" : "#fef2f2", color: !transitions.includes("cancelled") ? "#9ca3af" : "#dc2626", cursor: !transitions.includes("cancelled") ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      title="Cancel Order"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      style={{ padding: "10px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      title="Download Invoice"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px", padding: "16px 0" }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: "8px", background: page <= 1 ? "#f3f4f6" : "#fff", color: page <= 1 ? "#9ca3af" : "#374151", cursor: page <= 1 ? "not-allowed" : "pointer", fontSize: "13px" }}>
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const start = Math.max(1, page - 2);
                const p = start + i;
                if (p > pagination.totalPages) return null;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ padding: "8px 14px", border: page === p ? "none" : "1px solid #d1d5db", borderRadius: "8px", background: page === p ? "#3b82f6" : "#fff", color: page === p ? "#fff" : "#374151", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages}
                style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: "8px", background: page >= pagination.totalPages ? "#f3f4f6" : "#fff", color: page >= pagination.totalPages ? "#9ca3af" : "#374151", cursor: page >= pagination.totalPages ? "not-allowed" : "pointer", fontSize: "13px" }}>
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showStatusModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#111827" }}>Update Order Status</h3>
              <button onClick={() => setShowStatusModal(null)} style={{ border: "none", background: "#f3f4f6", borderRadius: "8px", padding: "6px", cursor: "pointer", display: "flex" }}>
                <X size={18} color="#6b7280" />
              </button>
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>New Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                >
                  <option value="">Select status...</option>
                  {getTransitions(orders.find((o) => o._id === showStatusModal)?.status || "").map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Notes (optional)</label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Additional notes about this status update..."
                  rows={3}
                  style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "13px", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>
              {statusError && (
                <div style={{ padding: "10px", background: "#fef2f2", color: "#dc2626", borderRadius: "8px", fontSize: "13px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <AlertTriangle size={14} /> {statusError}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={() => setShowStatusModal(null)} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff", color: "#374151", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={!selectedStatus || actionLoading === "status"}
                  style={{ padding: "10px 24px", border: "none", borderRadius: "8px", background: !selectedStatus ? "#93c5fd" : "#3b82f6", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: !selectedStatus ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {actionLoading === "status" ? <Loader2 size={16} className="spinner" /> : <Clock size={16} />}
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeliveryForm && (
        <DeliveryForm
          order={orders.find((o) => o._id === showDeliveryForm)}
          onSave={handleDeliverySave}
          onClose={() => setShowDeliveryForm(null)}
        />
      )}
    </div>
  );
};

export default AdminOrders;
