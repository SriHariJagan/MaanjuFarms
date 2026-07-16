import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Package, User, MapPin, Truck, ChevronDown, ChevronUp,
  Phone, Mail, CalendarDays, Filter, RefreshCw, AlertCircle,
  X, Eye
} from "lucide-react";
import { API_BASE } from "../../urls";
import { useAuth } from "../../Store/useContext";
import "./AdminOrders.css";

const statusSteps = ["pending", "confirmed", "shipped", "delivered"];

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("orders");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [expanded, setExpanded] = useState({});
  const [updating, setUpdating] = useState(null);
  const [detailId, setDetailId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      const [ordersRes, bookingsRes] = await Promise.all([
        axios.get(`${API_BASE}/orders/all`, authHeaders),
        axios.get(`${API_BASE}/bookings`, authHeaders),
      ]);
      const sortByDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
      const ordersData = ordersRes.data;
      const bookingsData = bookingsRes.data;
      setOrders((Array.isArray(ordersData) ? ordersData : (ordersData?.orders || [])).sort(sortByDate));
      setBookings((Array.isArray(bookingsData) ? bookingsData : (bookingsData?.bookings || [])).sort(sortByDate));
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const updateStatus = async (id, status, type) => {
    setUpdating(id);
    try {
      if (type === "order") {
        await axios.put(`${API_BASE}/orders/update/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
        setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
      } else {
        await axios.put(`${API_BASE}/bookings/update/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
        setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
      }
    } catch {
      console.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const filterByDate = (date) => {
    if (!date || dateFilter === "all") return true;
    const d = new Date(date);
    const today = new Date();
    if (dateFilter === "today") return d.toDateString() === today.toDateString();
    if (dateFilter === "week") {
      const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
      return d >= weekAgo;
    }
    if (dateFilter === "month") return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    return true;
  };

  const filteredData = useMemo(() => {
    const data = tab === "orders" ? orders : bookings;
    return data.filter((item) => {
      const q = search.toLowerCase();
      const name = item.user?.name || item.name || "";
      const email = item.user?.email || "";
      const id = item._id || "";
      const matchesSearch = name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || id.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesDate = filterByDate(item.createdAt);
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, bookings, search, tab, statusFilter, dateFilter]);

  const selectedOrder = detailId ? (tab === "orders" ? orders.find((o) => o._id === detailId) : bookings.find((b) => b._id === detailId)) : null;

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="admin-toolbar"><h2 style={{ fontSize: "1.2rem", margin: 0 }}>Orders</h2></div>
        <div className="admin-skeleton-list">{Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="admin-skeleton-row"><div className="admin-skeleton admin-skeleton--text" style={{ width: "100%", height: 48 }} /></div>
        ))}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders-page">
        <div className="admin-error-state">
          <AlertCircle size={48} /><h3>Failed to load orders</h3><p>{error}</p>
          <button className="admin-btn admin-btn--primary" onClick={fetchData}><RefreshCw size={16} /> Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <div className="admin-tab-group">
            <button className={`admin-tab ${tab === "orders" ? "admin-tab--active" : ""}`} onClick={() => setTab("orders")}>Orders ({orders.length})</button>
            <button className={`admin-tab ${tab === "bookings" ? "admin-tab--active" : ""}`} onClick={() => setTab("bookings")}>Bookings ({bookings.length})</button>
          </div>
        </div>
        <button className="admin-btn admin-btn--ghost" onClick={fetchData}><RefreshCw size={15} /></button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <div className="admin-search">
            <Search size={16} />
            <input type="text" placeholder="Search by name, email or ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="admin-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            {tab === "orders" ? statusSteps.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>) : ["pending", "confirmed", "cancelled"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select className="admin-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Past Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="admin-empty-state">
          <Package size={48} /><h3>No {tab} found</h3><p>Try a different filter</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>{tab === "orders" ? "Items" : "Villa"}</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item._id}>
                  <td><span className="admin-order-id">#{item._id?.slice(-6)}</span></td>
                  <td>
                    <div className="admin-order-customer">
                      <div className="admin-order-avatar">{item.user?.name?.charAt(0) || "?"}</div>
                      <div>
                        <p className="admin-order-customer-name">{item.user?.name || "Guest"}</p>
                        <p className="admin-order-customer-email">{item.user?.email || ""}</p>
                      </div>
                    </div>
                  </td>
                  <td>{tab === "orders" ? (item.items?.length || item.products?.length || 0) : item.villa?.name || item.name || "Villa"}</td>
                  <td className="admin-cell-price">₹{(item.totalAmount || 0).toLocaleString()}</td>
                  <td className="admin-order-date">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</td>
                  <td>
                    <select
                      className={`admin-order-status-select admin-order-status--${item.status || "pending"}`}
                      value={item.status || "pending"}
                      onChange={(e) => updateStatus(item._id, e.target.value, tab === "orders" ? "order" : "booking")}
                      disabled={updating === item._id}
                    >
                      {(tab === "orders" ? statusSteps : ["pending", "confirmed", "cancelled"]).map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="admin-action-btns">
                      <button className="admin-action-btn" onClick={() => toggleExpand(item._id)} title="Details">
                        {expanded[item._id] ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {Object.keys(expanded).filter((id) => expanded[id]).map((id) => {
          const item = [...orders, ...bookings].find((i) => i._id === id);
          if (!item) return null;
          return (
            <motion.div key={id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="admin-order-expanded">
              <div className="admin-order-detail-grid">
                <div className="admin-order-detail-section">
                  <h4><User size={14} /> Customer</h4>
                  <p>{item.user?.name || "Guest"}</p>
                  {item.user?.email && <p><Mail size={12} /> {item.user.email}</p>}
                  {item.user?.phone && <p><Phone size={12} /> {item.user.phone}</p>}
                </div>
                {tab === "orders" && item.shippingAddress && (
                  <div className="admin-order-detail-section">
                    <h4><MapPin size={14} /> Shipping</h4>
                    <p>{item.shippingAddress.address}, {item.shippingAddress.city}</p>
                    <p>{item.shippingAddress.state} - {item.shippingAddress.pincode}</p>
                  </div>
                )}
                {tab === "bookings" && (
                  <div className="admin-order-detail-section">
                    <h4><CalendarDays size={14} /> Dates</h4>
                    <p>Check-in: {item.checkIn ? new Date(item.checkIn).toLocaleDateString() : "-"}</p>
                    <p>Check-out: {item.checkOut ? new Date(item.checkOut).toLocaleDateString() : "-"}</p>
                  </div>
                )}
                {tab === "orders" && item.items && (
                  <div className="admin-order-detail-section">
                    <h4><Package size={14} /> Items</h4>
                    {(item.items || []).map((li, i) => (
                      <p key={i}>{li.name || li.product?.name} × {li.quantity} — ₹{(li.price || 0).toLocaleString()}</p>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
