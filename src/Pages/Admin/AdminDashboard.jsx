import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Package, ShoppingBag, Image as ImageIcon, MessageSquare,
  TrendingUp, TrendingDown, RefreshCw, AlertCircle
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { useAuth } from "../../Store/useContext";
import { PRODUCTS_API, GALLERY_API, API_BASE } from "../../urls";
import "./AdminDashboard.css";

const COLORS = ["#609966", "#9DC08B", "#40513B", "#7BAF78", "#2A3526", "#B8D9B0"];

const AdminDashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    products: [],
    orders: [],
    bookings: [],
    galleryImages: [],
    messages: [],
  });

  const extractArray = (res) => {
    if (!res) return [];
    const d = res.data;
    if (Array.isArray(d)) return d;
    if (d?.products && Array.isArray(d.products)) return d.products;
    if (d?.rooms && Array.isArray(d.rooms)) return d.rooms;
    if (d?.images && Array.isArray(d.images)) return d.images;
    if (d?.data && Array.isArray(d.data)) return d.data;
    return [];
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      const [productsRes, ordersRes, galleryRes, bookingsRes] = await Promise.allSettled([
        axios.get(PRODUCTS_API),
        axios.get(`${API_BASE}/orders/all`, authHeaders),
        axios.get(GALLERY_API),
        axios.get(`${API_BASE}/bookings`, authHeaders),
      ]);

      setData({
        products: extractArray(productsRes.value),
        orders: extractArray(ordersRes.value),
        bookings: extractArray(bookingsRes.value),
        galleryImages: extractArray(galleryRes.value),
      });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const { products, orders, bookings, galleryImages } = data;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalBookings = bookings.length;

  const metrics = [
    {
      label: "Products", value: products.length, icon: Package,
      color: "#609966", bg: "rgba(96, 153, 102, 0.08)",
    },
    {
      label: "Orders", value: orders.length, icon: ShoppingBag,
      color: "#40513B", bg: "rgba(64, 81, 59, 0.08)",
    },
    {
      label: "Revenue", value: `₹${(totalRevenue + totalBookings * 5000).toLocaleString()}`, icon: TrendingUp,
      color: "#7BAF78", bg: "rgba(123, 175, 120, 0.08)",
    },
    {
      label: "Bookings", value: totalBookings, icon: MessageSquare,
      color: "#9DC08B", bg: "rgba(157, 192, 139, 0.08)",
    },
    {
      label: "Gallery", value: galleryImages.length, icon: ImageIcon,
      color: "#2A3526", bg: "rgba(42, 53, 38, 0.08)",
    },
  ];

  const categoryData = products.reduce((acc, p) => {
    const cat = p.category || "Uncategorized";
    const existing = acc.find((c) => c.name === cat);
    if (existing) existing.value++;
    else acc.push({ name: cat, value: 1 });
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  const monthlyOrders = orders.reduce((acc, o) => {
    if (!o.createdAt) return acc;
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const existing = acc.find((m) => m.month === key);
    if (existing) existing.orders++;
    else acc.push({ month: key, orders: 1 });
    return acc;
  }, []).sort((a, b) => a.month.localeCompare(b.month));

  const topProducts = orders
    .flatMap((o) => o.items || o.products || [])
    .reduce((acc, item) => {
      const name = item.name || item.product?.name || "Unknown";
      const existing = acc.find((p) => p.name === name);
      if (existing) existing.sold += item.quantity || 1;
      else acc.push({ name, sold: item.quantity || 1 });
      return acc;
    }, [])
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dash-header">
          <h2>Dashboard</h2>
          <p className="admin-dash-subtitle">Overview of your farm</p>
        </div>
        <div className="admin-dash-metrics">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="admin-dash-skeleton-card">
              <div className="admin-skeleton admin-skeleton--dash-icon" />
              <div className="admin-dash-skeleton-content">
                <div className="admin-skeleton admin-skeleton--dash-label" />
                <div className="admin-skeleton admin-skeleton--dash-value" />
              </div>
            </div>
          ))}
        </div>
        <div className="admin-dash-charts">
          <div className="admin-dash-chart-card">
            <div className="admin-skeleton admin-skeleton--chart" />
          </div>
          <div className="admin-dash-chart-card">
            <div className="admin-skeleton admin-skeleton--chart" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="admin-error-state">
          <AlertCircle size={48} />
          <h3>Failed to load dashboard</h3>
          <p>{error}</p>
          <button className="admin-btn admin-btn--primary" onClick={fetchAll}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dash-header">
        <div>
          <h2>Dashboard</h2>
          <p className="admin-dash-subtitle">Overview of your farm & business</p>
        </div>
        <button className="admin-btn admin-btn--ghost" onClick={fetchAll}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="admin-dash-metrics">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            className="admin-dash-metric-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="admin-dash-metric-icon" style={{ background: m.bg, color: m.color }}>
              <m.icon size={22} />
            </div>
            <div className="admin-dash-metric-body">
              <span className="admin-dash-metric-value">{m.value}</span>
              <span className="admin-dash-metric-label">{m.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="admin-dash-charts">
        <motion.div
          className="admin-dash-chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h3 className="admin-dash-chart-title">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyOrders.length > 0 ? monthlyOrders : [{ month: "No data", orders: 0 }]}>
              <defs>
                <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#609966" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#609966" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eae8e3" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#b0aca4" }} />
              <YAxis tick={{ fontSize: 12, fill: "#b0aca4" }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eae8e3", background: "#fff" }} />
              <Area type="monotone" dataKey="orders" stroke="#609966" fill="url(#orderGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="admin-dash-chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <h3 className="admin-dash-chart-title">Product Categories</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData.length > 0 ? categoryData : [{ name: "No data", value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {(categoryData.length > 0 ? categoryData : [{ name: "No data", value: 1 }]).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eae8e3" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="admin-dash-legend">
            {(categoryData.length > 0 ? categoryData : []).map((c, i) => (
              <div key={c.name} className="admin-dash-legend-item">
                <span style={{ background: COLORS[i % COLORS.length] }} />
                <span>{c.name}</span>
                <span>{c.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="admin-dash-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <h3 className="admin-dash-chart-title">Top Selling Products</h3>
        <div className="admin-dash-top-products">
          {topProducts.length > 0 ? topProducts.map((p, i) => (
            <div key={p.name} className="admin-dash-top-item">
              <span className="admin-dash-top-rank">{i + 1}</span>
              <div className="admin-dash-top-bar" style={{ width: `${(p.sold / topProducts[0].sold) * 100}%` }} />
              <span className="admin-dash-top-name">{p.name}</span>
              <span className="admin-dash-top-sold">{p.sold} sold</span>
            </div>
          )) : (
            <p className="admin-dash-no-data">No sales data yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
