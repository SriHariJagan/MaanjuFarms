import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Search, Package, CalendarDays, ChevronDown, ChevronUp, MapPin, Truck, BadgeCheck,
  Clock, XCircle, DollarSign, Filter, X, Loader2,
  ArrowUpDown, AlertTriangle
} from "lucide-react";
import styles from "./UserOrders.module.css";
import { API_BASE, ORDERS_API } from "../../../urls";
import StatusBadge from "../../../Components/orders/StatusBadge";
import OrderTimeline from "../../../Components/orders/OrderTimeline";

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const slideDown = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

const initialFilterState = {
  search: "",
  status: "all",
  sortBy: "newest",
  page: 1,
  limit: 10,
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [filters, setFilters] = useState(initialFilterState);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
      });
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.search) params.set("search", filters.search);

      const [ordersRes] = await Promise.all([
        axios.get(`${ORDERS_API.MY_ORDERS}?${params}`, { headers }),
        axios.get(`${API_BASE}/bookings/my-bookings`, { headers }),
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders);
        setPagination(ordersRes.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/bookings/my-bookings`, { headers });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    } else {
      fetchBookings();
    }
  }, [activeTab, fetchOrders, fetchBookings]);

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const stats = useMemo(() => {
    const completed = orders.filter((o) => o.status === "delivered");
    const active = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
    const cancelled = orders.filter((o) => o.status === "cancelled");
    const totalSpending = completed.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const latestOrder = orders.length > 0 ? orders[0] : null;
    return { total: orders.length, completed: completed.length, active: active.length, cancelled: cancelled.length, totalSpending, latestOrder };
  }, [orders]);

  const handleCancelOrder = async () => {
    if (!showCancelModal) return;
    try {
      setCancellingId(showCancelModal);
      const { data } = await axios.post(
        ORDERS_API.CANCEL(showCancelModal),
        { reason: cancelReason || "Cancelled by customer" },
        { headers }
      );
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o._id === showCancelModal ? data.order : o)));
        setShowCancelModal(null);
        setCancelReason("");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const changePage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className={styles.userOrders}>
      <div className={styles.header}>
        <div>
          <h2>{activeTab === "orders" ? "My Orders" : "My Bookings"}</h2>
          <p>Track, manage, and view your order history</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.switchTabs}>
            <button className={activeTab === "orders" ? styles.activeTab : ""} onClick={() => setActiveTab("orders")}>
              <Package size={18} /> Orders
            </button>
            <button className={activeTab === "bookings" ? styles.activeTab : ""} onClick={() => setActiveTab("bookings")}>
              <CalendarDays size={18} /> Bookings
            </button>
          </div>
        </div>
      </div>

      {activeTab === "orders" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            {[
              { icon: Package, label: "Total Orders", value: stats.total, color: "#3b82f6", bg: "#dbeafe" },
              { icon: Clock, label: "Active", value: stats.active, color: "#f59e0b", bg: "#fef3c7" },
              { icon: BadgeCheck, label: "Completed", value: stats.completed, color: "#10b981", bg: "#d1fae5" },
              { icon: XCircle, label: "Cancelled", value: stats.cancelled, color: "#ef4444", bg: "#fee2e2" },
              { icon: DollarSign, label: "Total Spent", value: `₹${stats.totalSpending.toLocaleString("en-IN")}`, color: "#059669", bg: "#d1fae5" },
            ].map((card, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <card.icon size={18} color={card.color} />
                </div>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>{card.label}</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{card.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input
                type="text"
                placeholder="Search orders..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff" }}>
              <Filter size={14} color="#6b7280" />
              <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} style={{ border: "none", outline: "none", fontSize: "13px", color: "#374151", background: "transparent" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff" }}>
              <ArrowUpDown size={14} color="#6b7280" />
              <select value={filters.sortBy} onChange={(e) => handleFilterChange("sortBy", e.target.value)} style={{ border: "none", outline: "none", fontSize: "13px", color: "#374151", background: "transparent" }}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Highest Amount</option>
                <option value="amount-low">Lowest Amount</option>
              </select>
            </div>
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ padding: "24px", background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                  <div style={{ height: "20px", width: "40%", borderRadius: "4px", background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", marginBottom: "12px" }} />
                  <div style={{ height: "14px", width: "60%", borderRadius: "4px", background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
              <Package size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
              <h3 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 8px", color: "#6b7280" }}>No orders found</h3>
              <p style={{ fontSize: "14px" }}>Start shopping to see your orders here</p>
            </div>
          ) : (
            <div className={styles.ordersWrapper}>
              {orders.map((order) => {
                const isOpen = expandedOrders[order._id];
                return (
                  <motion.div className={styles.orderCard} key={order._id} variants={fadeUp} layout>
                    <div className={styles.orderSummary} onClick={() => toggleOrder(order._id)}>
                      <div className={styles.summaryLeft}>
                        <div className={styles.orderIcon}><Package size={22} /></div>
                        <div>
                          <h3>Order #{order._id?.slice(-8)}</h3>
                          <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <div className={styles.summaryCenter}>
                        <div><label>Total</label><h4>₹{(order.totalAmount || 0).toLocaleString("en-IN")}</h4></div>
                        <div><label>Items</label><h4>{order.products?.length || 0}</h4></div>
                      </div>
                      <div className={styles.summaryRight}>
                        <StatusBadge status={order.status} />
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    <motion.div
                      className={styles.orderDetails}
                      variants={slideDown}
                      initial="initial"
                      animate={isOpen ? "animate" : "initial"}
                      style={{ display: isOpen ? "block" : "none" }}
                    >
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
                        <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "16px" }}>
                          <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#374151", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Payment</h4>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "13px", color: "#6b7280" }}>Status</span>
                            <StatusBadge status={order.paymentStatus} size="sm" />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                            <span style={{ fontSize: "13px", color: "#6b7280" }}>Amount</span>
                            <span style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>₹{(order.totalAmount || 0).toLocaleString("en-IN")}</span>
                          </div>
                          {order.discountAmount > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                              <span style={{ fontSize: "13px", color: "#6b7280" }}>Discount</span>
                              <span style={{ fontSize: "13px", fontWeight: 600, color: "#10b981" }}>-₹{(order.discountAmount || 0).toLocaleString("en-IN")}</span>
                            </div>
                          )}
                        </div>
                        <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "16px" }}>
                          <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#374151", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Delivery</h4>
                          {order.delivery?.partner ? (
                            <>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "13px", color: "#6b7280" }}>Partner</span>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{order.delivery.partner}</span>
                              </div>
                              {order.delivery.trackingNumber && (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                                  <span style={{ fontSize: "13px", color: "#6b7280" }}>Tracking</span>
                                  {order.delivery.trackingUrl ? (
                                    <a href={order.delivery.trackingUrl} target="_blank" rel="noreferrer" style={{ fontSize: "13px", fontWeight: 600, color: "#3b82f6", textDecoration: "underline" }}>
                                      {order.delivery.trackingNumber}
                                    </a>
                                  ) : (
                                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{order.delivery.trackingNumber}</span>
                                  )}
                                </div>
                              )}
                              {order.delivery.estimatedDelivery && (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                                  <span style={{ fontSize: "13px", color: "#6b7280" }}>Est. Delivery</span>
                                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>
                                    {new Date(order.delivery.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <p style={{ fontSize: "13px", color: "#9ca3af" }}>Not yet assigned</p>
                          )}
                        </div>
                      </div>

                      <div className={styles.section}>
                        <div className={styles.sectionTitle}>Products ({order.products?.length})</div>
                        <div className={styles.productsWrapper}>
                          {order.products?.map((item) => (
                            <div className={styles.productItem} key={item._id}>
                              <div className={styles.productImageWrapper}>
                                <img src={item.product?.image || item.imageAtOrder || "/placeholder.jpg"} alt="" />
                              </div>
                              <div className={styles.productContent}>
                                <h4>{item.product?.name || item.nameAtOrder || "Product"}</h4>
                                <p>Qty: <span>{item.quantity}</span></p>
                                <p style={{ fontSize: "15px", fontWeight: 700, color: "#059669" }}>₹{((item.product?.price || item.priceAtOrder || 0)).toLocaleString("en-IN")}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={styles.section}>
                        <div className={styles.sectionTitle}>Delivery Address</div>
                        <div className={styles.addressBox}>
                          <MapPin size={18} />
                          <span>
                            {order.deliveryAddress?.name && <strong>{order.deliveryAddress.name}</strong>}
                            {order.deliveryAddress?.street && <>, {order.deliveryAddress.street}</>}
                            {order.deliveryAddress?.city && <>, {order.deliveryAddress.city}</>}
                            {order.deliveryAddress?.district && <>, {order.deliveryAddress.district}</>}
                            {order.deliveryAddress?.state && <>, {order.deliveryAddress.state}</>}
                            {order.deliveryAddress?.pincode && <> - {order.deliveryAddress.pincode}</>}
                            {order.deliveryAddress?.phone && <><br />📞 {order.deliveryAddress.phone}</>}
                          </span>
                        </div>
                      </div>

                      <div className={styles.section}>
                        <div className={styles.sectionTitle}>Order Timeline</div>
                        <OrderTimeline timeline={order.timeline || []} currentStatus={order.status} />
                      </div>

                      <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                        {["pending", "confirmed", "processing", "packed"].includes(order.status) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowCancelModal(order._id); }}
                            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "1px solid #fecaca", borderRadius: "8px", background: "#fef2f2", color: "#dc2626", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                          >
                            <X size={14} /> Cancel Order
                          </button>
                        )}
                        {order.delivery?.trackingUrl && (
                          <a href={order.delivery.trackingUrl} target="_blank" rel="noreferrer"
                            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "1px solid #dbeafe", borderRadius: "8px", background: "#eff6ff", color: "#2563eb", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
                          >
                            <Truck size={14} /> Track Package
                          </a>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}

              {pagination.totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px" }}>
                  <button
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: "8px", background: pagination.page <= 1 ? "#f3f4f6" : "#fff", color: pagination.page <= 1 ? "#9ca3af" : "#374151", cursor: pagination.page <= 1 ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 500 }}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const start = Math.max(1, pagination.page - 2);
                    const pageNum = start + i;
                    if (pageNum > pagination.totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => changePage(pageNum)}
                        style={{
                          padding: "8px 14px",
                          border: pagination.page === pageNum ? "none" : "1px solid #d1d5db",
                          borderRadius: "8px",
                          background: pagination.page === pageNum ? "#3b82f6" : "#fff",
                          color: pagination.page === pageNum ? "#fff" : "#374151",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: "8px", background: pagination.page >= pagination.totalPages ? "#f3f4f6" : "#fff", color: pagination.page >= pagination.totalPages ? "#9ca3af" : "#374151", cursor: pagination.page >= pagination.totalPages ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 500 }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === "bookings" && (
        <div className={styles.ordersWrapper}>
          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
              <CalendarDays size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
              <h3 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 8px", color: "#6b7280" }}>No bookings found</h3>
              <p style={{ fontSize: "14px" }}>Book a villa to see your reservations here</p>
            </div>
          ) : (
            bookings.map((booking) => {
              const isOpen = expandedOrders[booking._id];
              return (
                <motion.div className={styles.orderCard} key={booking._id} variants={fadeUp} layout>
                  <div className={styles.orderSummary} onClick={() => toggleOrder(booking._id)}>
                    <div className={styles.summaryLeft}>
                      <div className={styles.orderIcon}><CalendarDays size={22} /></div>
                      <div>
                        <h3>Booking #{booking._id?.slice(-8)}</h3>
                        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                          {new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className={styles.summaryCenter}>
                      <div><label>Total</label><h4>₹{(booking.totalAmount || 0).toLocaleString("en-IN")}</h4></div>
                      <div><label>Guests</label><h4>{booking.guests || 1}</h4></div>
                    </div>
                    <div className={styles.summaryRight}>
                      <StatusBadge status={booking.status} />
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  <motion.div
                    className={styles.orderDetails}
                    variants={slideDown}
                    initial="initial"
                    animate={isOpen ? "animate" : "initial"}
                    style={{ display: isOpen ? "block" : "none" }}
                  >
                    <div style={{ display: "flex", gap: "16px", marginTop: "20px", background: "#f9fafb", borderRadius: "10px", padding: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "4px" }}>Check In</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>{new Date(booking.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "4px" }}>Check Out</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>{new Date(booking.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "4px" }}>Payment</div>
                        <StatusBadge status={booking.paymentStatus} size="sm" />
                      </div>
                    </div>

                    {booking.room && (
                      <div className={styles.roomCard} style={{ marginTop: "16px" }}>
                        <img src={booking.room.image || "/placeholder.jpg"} alt={booking.room.name} />
                        <div className={styles.roomContent}>
                          <h3>{booking.room.name}</h3>
                          <p>{booking.room.description}</p>
                        </div>
                      </div>
                    )}

                    {booking.guestDetails?.length > 0 && (
                      <div className={styles.section}>
                        <div className={styles.sectionTitle}>Guest Details</div>
                        <div className={styles.guestGrid}>
                          {booking.guestDetails.map((guest, index) => (
                            <div className={styles.guestCard} key={index}>
                              <h4>{guest.name}</h4>
                              <p>Age: {guest.age}</p>
                              <p>Gender: {guest.gender}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {showCancelModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "420px", padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 600, color: "#111827" }}>Cancel Order</h3>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#6b7280" }}>Are you sure you want to cancel this order? This action cannot be undone.</p>
            <textarea
              placeholder="Reason for cancellation (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "13px", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button onClick={() => { setShowCancelModal(null); setCancelReason(""); }} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff", color: "#374151", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                Keep Order
              </button>
              <button onClick={handleCancelOrder} disabled={cancellingId === showCancelModal} style={{ padding: "10px 20px", border: "none", borderRadius: "8px", background: "#dc2626", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                {cancellingId === showCancelModal ? <Loader2 size={16} className="spinner" /> : <X size={16} />}
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
