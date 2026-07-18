import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search, Package, CalendarDays, User, MapPin, Truck, ChevronDown, ChevronUp,
  Phone, Mail, Filter, ArrowUpDown, RefreshCw, Send, X, Loader2, Download,
  AlertTriangle, Clock, Eye
} from "lucide-react";
import styles from "./OrdersPage.module.css";
import { ORDERS_API } from "../../../urls";
import { useAuth } from "../../../Store/useContext";
import StatusBadge from "../../../Components/orders/StatusBadge";
import OrderStats from "../../../Components/orders/OrderStats";
import OrderTimeline from "../../../Components/orders/OrderTimeline";
import DeliveryForm from "../../../Components/orders/DeliveryForm";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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

const OrdersPage = () => {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

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
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <motion.div
        className={styles.pageHeader}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className={styles.pageTitle}>Order Management</h1>
          <p className={styles.pageSubtitle}>Manage and monitor all customer product orders.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <motion.button
            className={styles.headerBtn}
            onClick={() => { fetchStats(); fetchOrders(); }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      <OrderStats stats={stats} loading={statsLoading} />

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
          <Filter size={16} color="#6b7280" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ border: "none", outline: "none", fontSize: "13px", fontFamily: "inherit", color: "#374151", background: "transparent", cursor: "pointer" }}
          >
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

        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
          <CalendarDays size={16} color="#6b7280" />
          <select
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
            style={{ border: "none", outline: "none", fontSize: "13px", fontFamily: "inherit", color: "#374151", background: "transparent", cursor: "pointer" }}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
          <ArrowUpDown size={16} color="#6b7280" />
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            style={{ border: "none", outline: "none", fontSize: "13px", fontFamily: "inherit", color: "#374151", background: "transparent", cursor: "pointer" }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="amount-high">Highest Amount</option>
            <option value="amount-low">Lowest Amount</option>
          </select>
        </div>

        <div style={{ padding: "8px 14px", background: "rgba(96,153,102,0.08)", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "#609966" }}>
          {pagination.total} Orders
        </div>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
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
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Package size={48} />
          </div>
          <h3 className={styles.emptyTitle}>No orders found</h3>
          <p className={styles.emptyText}>No orders match your current filters.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "20px" }}>
            {orders.map((order) => {
              const isExpanded = expandedOrders[order._id];
              const transitions = getTransitions(order.status);
              return (
                <motion.div
                  key={order._id}
                  variants={fadeUp}
                  layout
                  style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(59,130,246,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", flexShrink: 0 }}>
                          <Package size={22} />
                        </div>
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>
                            ORDER #{order._id?.slice(-8)}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", fontSize: "13px", color: "#6b7280" }}>
                            <CalendarDays size={14} />
                            <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "#f9fafb", borderRadius: "8px" }}>
                        <User size={18} color="#6b7280" />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>Name</div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.user?.name || "N/A"}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "#f9fafb", borderRadius: "8px" }}>
                        <Mail size={18} color="#6b7280" />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>Email</div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.user?.email || "N/A"}</div>
                        </div>
                      </div>
                      {order.deliveryAddress?.phone && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "#f9fafb", borderRadius: "8px" }}>
                          <Phone size={18} color="#6b7280" />
                          <div>
                            <div style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>Phone</div>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{order.deliveryAddress.phone}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {(order.deliveryAddress?.street || order.deliveryAddress?.city) && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px", background: "#f9fafb", borderRadius: "10px", marginBottom: "12px" }}>
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

                    <div style={{ marginBottom: "12px" }}>
                      <button
                        onClick={() => toggleOrder(order._id)}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "inherit" }}
                      >
                        <span>Products ({order.products?.length}) & Details</span>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: "hidden" }}
                          >
                            <div style={{ padding: "12px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                              {order.products?.map((item) => (
                                <div key={item._id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: "#f9fafb", borderRadius: "8px" }}>
                                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", background: "#e5e7eb", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {item.product?.image ? (
                                      <img src={item.product.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                      <Package size={16} color="#9ca3af" />
                                    )}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{item.product?.name || item.nameAtOrder || "Product"}</div>
                                    <div style={{ fontSize: "12px", color: "#6b7280" }}>Qty: {item.quantity}</div>
                                  </div>
                                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>
                                    ₹{((item.product?.price || item.priceAtOrder || 0)).toLocaleString("en-IN")}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {order.delivery?.partner && (
                              <div style={{ padding: "12px", background: "#eff6ff", borderRadius: "8px", border: "1px solid #dbeafe", marginBottom: "12px" }}>
                                <div style={{ fontSize: "11px", fontWeight: 600, color: "#1e40af", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                                  <Truck size={14} /> Delivery Info
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
                              <div style={{ marginBottom: "12px" }}>
                                <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", marginBottom: "12px" }}>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>Total Amount</div>
                        <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>₹{(order.totalAmount || 0).toLocaleString("en-IN")}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>Payment</div>
                        <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 700, background: order.paymentStatus === "paid" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", color: order.paymentStatus === "paid" ? "#059669" : "#d97706" }}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => openStatusModal(order)}
                        disabled={transitions.length === 0}
                        style={{ flex: 1, padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "8px", background: transitions.length === 0 ? "#f3f4f6" : "#fff", color: transitions.length === 0 ? "#9ca3af" : "#374151", cursor: transitions.length === 0 ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", minWidth: "100px" }}
                      >
                        <Clock size={14} /> Status
                      </button>
                      <button
                        onClick={() => setShowDeliveryForm(order._id)}
                        disabled={["delivered", "cancelled"].includes(order.status)}
                        style={{ flex: 1, padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "8px", background: ["delivered", "cancelled"].includes(order.status) ? "#f3f4f6" : "#fff", color: ["delivered", "cancelled"].includes(order.status) ? "#9ca3af" : "#374151", cursor: ["delivered", "cancelled"].includes(order.status) ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", minWidth: "100px" }}
                      >
                        <Truck size={14} /> Delivery
                      </button>
                      <button
                        onClick={() => handleResendEmail(order._id)}
                        disabled={actionLoading === "email"}
                        style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Resend Email"
                      >
                        <Send size={14} />
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={!transitions.includes("cancelled") || actionLoading === "cancel"}
                        style={{ padding: "8px 10px", border: "1px solid #fecaca", borderRadius: "8px", background: !transitions.includes("cancelled") ? "#f3f4f6" : "#fef2f2", color: !transitions.includes("cancelled") ? "#9ca3af" : "#dc2626", cursor: !transitions.includes("cancelled") ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Cancel Order"
                      >
                        <X size={14} />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Download Invoice"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px", padding: "16px 0" }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: "8px", background: page <= 1 ? "#f3f4f6" : "#fff", color: page <= 1 ? "#9ca3af" : "#374151", cursor: page <= 1 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "inherit" }}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const start = Math.max(1, page - 2);
                const p = start + i;
                if (p > pagination.totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{ padding: "8px 14px", border: page === p ? "none" : "1px solid #d1d5db", borderRadius: "8px", background: page === p ? "#3b82f6" : "#fff", color: page === p ? "#fff" : "#374151", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "inherit" }}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: "8px", background: page >= pagination.totalPages ? "#f3f4f6" : "#fff", color: page >= pagination.totalPages ? "#9ca3af" : "#374151", cursor: page >= pagination.totalPages ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "inherit" }}
              >
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
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "13px", outline: "none", fontFamily: "inherit" }}
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
                <button onClick={() => setShowStatusModal(null)} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff", color: "#374151", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={!selectedStatus || actionLoading === "status"}
                  style={{ padding: "10px 24px", border: "none", borderRadius: "8px", background: !selectedStatus ? "#93c5fd" : "#3b82f6", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: !selectedStatus ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "inherit" }}
                >
                  {actionLoading === "status" ? <Loader2 size={16} /> : <Clock size={16} />}
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

export default OrdersPage;
