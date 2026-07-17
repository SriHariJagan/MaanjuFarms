// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   RefreshCw,
//   Download,
//   IndianRupee,
//   ShoppingCart,
//   CalendarCheck,
//   Building2,
//   Users,
//   Package,
//   TrendingUp,
//   TrendingDown,
//   AlertCircle,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Sprout,
//   BedDouble,
//   BarChart3,
//   PieChart,
//   Activity,
// } from "lucide-react";
// import {
//   LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart as RPieChart, Pie, Cell, AreaChart, Area, Legend,
// } from "recharts";
// import { useAuth } from "../../../Store/useContext";
// import { ORDERS_API, BOOKINGS_API, PRODUCTS_API, ROOMS_API, USERS_API } from "../../../urls";
// import styles from "./AnalyticsPage.module.css";

const PERIODS = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

const CHART_COLORS = ["#609966", "#40513B", "#9DC08B", "#c2823e", "#2563eb", "#d97706", "#ef4444", "#8b5cf6"];

const formatCurrency = (val) => {
  if (!val && val !== 0) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
};

const formatNumber = (val) => {
  if (!val && val !== 0) return "—";
  return new Intl.NumberFormat("en-IN").format(val);
};

const SkeletonCard = () => (
  <div className={styles.skelCard}>
    <div className={styles.skelIcon} />
    <div className={styles.skelLines}>
      <div className={styles.skelBox} style={{ width: "40%", height: 14 }} />
      <div className={styles.skelBox} style={{ width: "60%", height: 24 }} />
      <div className={styles.skelBox} style={{ width: "30%", height: 12 }} />
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className={styles.skelChart}>
    <div className={styles.skelBox} style={{ width: "100%", height: 250 }} />
  </div>
);

const PeriodSelector = ({ period, onChange }) => (
  <div className={styles.periodToggle}>
    {PERIODS.map((p) => (
      <button
        key={p.key}
        className={`${styles.periodBtn} ${period === p.key ? styles.periodBtnActive : ""}`}
        onClick={() => onChange(p.key)}
      >
        {p.label}
      </button>
    ))}
  </div>
);

const AnalyticsHeader = ({ onRefresh, refreshing, period, onPeriodChange }) => (
  <motion.div
    className={styles.pageHeader}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <div>
      <h1 className={styles.pageTitle}>Business Analytics</h1>
      <p className={styles.pageSubtitle}>Analyze revenue, bookings, product sales and business performance.</p>
    </div>
    <div className={styles.headerActions}>
      <PeriodSelector period={period} onChange={onPeriodChange} />
      <motion.button
        className={`${styles.headerBtn} ${styles.exportBtn}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        title="Export (UI only)"
      >
        <Download size={16} />
        <span>Export</span>
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

const OverviewCards = ({ data, loading }) => {
  const cards = [
    { key: "revenue", label: "Total Revenue", icon: IndianRupee, color: "#609966", format: formatCurrency },
    { key: "orders", label: "Total Orders", icon: ShoppingCart, color: "#2563eb", format: formatNumber },
    { key: "bookings", label: "Total Bookings", icon: CalendarCheck, color: "#d97706", format: formatNumber },
    { key: "customers", label: "Total Customers", icon: Users, color: "#40513B", format: formatNumber },
    { key: "products", label: "Total Products", icon: Package, color: "#c2823e", format: formatNumber },
    { key: "rooms", label: "Total Rooms", icon: Building2, color: "#8b5cf6", format: formatNumber },
  ];

  if (loading) {
    return (
      <div className={styles.overviewGrid}>
        {cards.map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className={styles.overviewGrid}>
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          className={styles.overviewCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(64,81,59,0.1)" }}
        >
          <div className={styles.overviewCardTop}>
            <span className={styles.overviewIcon} style={{ background: `${card.color}14`, color: card.color }}>
              <card.icon size={20} />
            </span>
            {data?.[card.key]?.change && (
              <span className={`${styles.changeBadge} ${data[card.key].change >= 0 ? styles.changePos : styles.changeNeg}`}>
                {data[card.key].change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(data[card.key].change)}%
              </span>
            )}
          </div>
          <div className={styles.overviewValue}>{card.format(data?.[card.key]?.value)}</div>
          <div className={styles.overviewLabel}>{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

const RevenueChart = ({ data, loading }) => {
  const chartData = useMemo(() => {
    if (!data?.length) return [];
    return data.map((d) => ({
      period: d._id || d.date || d.label || d.month || d.period || "",
      revenue: d.totalRevenue || d.revenue || d.amount || 0,
    }));
  }, [data]);

  const summary = useMemo(() => {
    if (!chartData.length) return null;
    const values = chartData.map((d) => d.revenue);
    const total = values.reduce((a, b) => a + b, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const maxIdx = values.indexOf(max);
    const minIdx = values.indexOf(min);
    return { avg, max, min, maxPeriod: chartData[maxIdx]?.period, minPeriod: chartData[minIdx]?.period };
  }, [chartData]);

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Revenue Analytics</h2>
          <p className={styles.sectionSub}>Revenue trends and performance metrics.</p>
        </div>
      </div>
      {loading ? <SkeletonChart /> : !chartData.length ? (
        <div className={styles.emptyMini}>
          <IndianRupee size={32} />
          <p>No Revenue Data Available</p>
        </div>
      ) : (
        <div className={styles.chartRow}>
          <div className={styles.chartMain}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#609966" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#609966" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(157,192,139,0.1)" />
                <XAxis dataKey="period" tick={{ fontSize: 12, fill: "rgba(64,81,59,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "rgba(64,81,59,0.4)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid rgba(157,192,139,0.1)", borderRadius: 10, boxShadow: "0 4px 20px rgba(64,81,59,0.08)" }}
                  formatter={(v) => [formatCurrency(v), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#609966" fill="url(#revGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartSidebar}>
            {summary && (
              <>
                <div className={styles.summaryCard}>
                  <span className={styles.summaryLabel}>Average Revenue</span>
                  <span className={styles.summaryValue}>{formatCurrency(summary.avg)}</span>
                </div>
                <div className={styles.summaryCard}>
                  <span className={styles.summaryLabel}>Highest ({summary.maxPeriod})</span>
                  <span className={styles.summaryValue}>{formatCurrency(summary.max)}</span>
                </div>
                <div className={styles.summaryCard}>
                  <span className={styles.summaryLabel}>Lowest ({summary.minPeriod})</span>
                  <span className={styles.summaryValue}>{formatCurrency(summary.min)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const OrderAnalytics = ({ data, loading }) => {
  const trendData = useMemo(() => {
    if (!data?.trend?.length) return [];
    return data.trend.map((d) => ({
      period: d._id || d.date || d.label || d.period || "",
      orders: d.count || d.orders || d.total || 0,
    }));
  }, [data]);

  const statusData = useMemo(() => {
    if (!data?.status?.length && !data?.statusCounts) return [];
    const raw = data.status || [];
    if (raw.length) return raw.map((s) => ({ name: s._id || s.status || s.label, value: s.count || s.total || 0 }));
    return Object.entries(data.statusCounts || {}).map(([name, value]) => ({ name, value }));
  }, [data]);

  if (loading) {
    return (
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Order Analytics</h2></div>
        <SkeletonChart />
      </div>
    );
  }

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Order Analytics</h2>
          <p className={styles.sectionSub}>Order trends and status distribution.</p>
        </div>
      </div>
      <div className={styles.doubleChartRow}>
        <div className={styles.halfChart}>
          {trendData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(157,192,139,0.1)" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: "rgba(64,81,59,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(64,81,59,0.4)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(157,192,139,0.1)" }} />
                <Line type="monotone" dataKey="orders" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: "#2563eb", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyMini}><ShoppingCart size={28} /><p>No order trend data</p></div>
          )}
        </div>
        <div className={styles.halfChart}>
          {statusData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <RPieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {statusData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(157,192,139,0.1)" }} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "rgba(64,81,59,0.5)" }}
                  formatter={(val) => <span style={{ color: "rgba(64,81,59,0.5)" }}>{val}</span>}
                />
              </RPieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyMini}><PieChart size={28} /><p>No order status data</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

const BookingAnalytics = ({ data, loading }) => {
  const trendData = useMemo(() => {
    if (!data?.trend?.length) return [];
    return data.trend.map((d) => ({
      period: d._id || d.date || d.label || d.period || "",
      bookings: d.count || d.bookings || d.total || 0,
    }));
  }, [data]);

  const statusData = useMemo(() => {
    if (!data?.status?.length && !data?.statusCounts) return [];
    const raw = data.status || [];
    if (raw.length) return raw.map((s) => ({ name: s._id || s.status || s.label, value: s.count || s.total || 0 }));
    return Object.entries(data.statusCounts || {}).map(([name, value]) => ({ name, value }));
  }, [data]);

  if (loading) {
    return (
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Booking Analytics</h2></div>
        <SkeletonChart />
      </div>
    );
  }

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Booking Analytics</h2>
          <p className={styles.sectionSub}>Booking trends and status breakdown.</p>
        </div>
      </div>
      <div className={styles.doubleChartRow}>
        <div className={styles.halfChart}>
          {trendData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(157,192,139,0.1)" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: "rgba(64,81,59,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(64,81,59,0.4)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(157,192,139,0.1)" }} />
                <Bar dataKey="bookings" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyMini}><CalendarCheck size={28} /><p>No booking trend data</p></div>
          )}
        </div>
        <div className={styles.halfChart}>
          {statusData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <RPieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={85} paddingAngle={3} dataKey="value">
                  {statusData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[(idx + 2) % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(157,192,139,0.1)" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} formatter={(val) => <span style={{ color: "rgba(64,81,59,0.5)" }}>{val}</span>} />
              </RPieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyMini}><PieChart size={28} /><p>No booking status data</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductAnalytics = ({ data, loading }) => {
  const topProducts = useMemo(() => {
    if (!data?.topProducts?.length) return [];
    return data.topProducts.slice(0, 8).map((p) => ({
      name: p.name || p._id || p.product || "",
      sold: p.sold || p.count || p.unitsSold || p.total || 0,
    }));
  }, [data]);

  const categoryData = useMemo(() => {
    if (!data?.categoryDistribution?.length) return [];
    return data.categoryDistribution.map((c) => ({
      name: c._id || c.category || c.label || "",
      value: c.count || c.total || c.products || 0,
    }));
  }, [data]);

  if (loading) {
    return (
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Product Analytics</h2></div>
        <SkeletonChart />
      </div>
    );
  }

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Product Analytics</h2>
          <p className={styles.sectionSub}>Top selling products and category distribution.</p>
        </div>
      </div>
      <div className={styles.doubleChartRow}>
        <div className={styles.halfChart}>
          {topProducts.length ? (
            <ResponsiveContainer width="100%" height={Math.max(200, topProducts.length * 32)}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 80, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(157,192,139,0.1)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "rgba(64,81,59,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "rgba(64,81,59,0.5)" }} axisLine={false} tickLine={false} width={75} />
                <Tooltip contentStyle={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(157,192,139,0.1)" }} />
                <Bar dataKey="sold" fill="#c2823e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyMini}><Package size={28} /><p>No product sales data</p></div>
          )}
        </div>
        <div className={styles.halfChart}>
          {categoryData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <RPieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={85} dataKey="value">
                  {categoryData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[(idx + 4) % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(157,192,139,0.1)" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} formatter={(val) => <span style={{ color: "rgba(64,81,59,0.5)" }}>{val}</span>} />
              </RPieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyMini}><PieChart size={28} /><p>No category data</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

const RoomAnalytics = ({ data, loading }) => {
  const topRooms = useMemo(() => {
    if (!data?.topRooms?.length) return [];
    return data.topRooms.slice(0, 8).map((r) => ({
      name: r.name || r._id || r.room || "",
      bookings: r.bookings || r.count || r.total || 0,
    }));
  }, [data]);

  if (loading) {
    return (
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Room Analytics</h2></div>
        <SkeletonChart />
      </div>
    );
  }

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Room Analytics</h2>
          <p className={styles.sectionSub}>Most booked rooms and occupancy trends.</p>
        </div>
      </div>
      <div className={styles.doubleChartRow}>
        <div className={styles.halfChart}>
          {topRooms.length ? (
            <ResponsiveContainer width="100%" height={Math.max(200, topRooms.length * 32)}>
              <BarChart data={topRooms} layout="vertical" margin={{ left: 80, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(157,192,139,0.1)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "rgba(64,81,59,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "rgba(64,81,59,0.5)" }} axisLine={false} tickLine={false} width={75} />
                <Tooltip contentStyle={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(157,192,139,0.1)" }} />
                <Bar dataKey="bookings" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyMini}><BedDouble size={28} /><p>No room booking data</p></div>
          )}
        </div>
        <div className={styles.halfChart}>
          {(data?.occupancy?.length > 0) ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.occupancy}>
                <defs>
                  <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(157,192,139,0.1)" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: "rgba(64,81,59,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(64,81,59,0.4)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(157,192,139,0.1)" }} />
                <Area type="monotone" dataKey="rate" stroke="#8b5cf6" fill="url(#occGrad)" strokeWidth={2} name="Occupancy %" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyMini}><Activity size={28} /><p>No occupancy data</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

const RecentActivity = ({ data, loading }) => {
  if (loading) {
    return (
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Recent Activity</h2></div>
        <div className={styles.activityList}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.activityItem}>
              <div className={styles.skelBox} style={{ width: 28, height: 28, borderRadius: 8 }} />
              <div className={styles.activityContent}>
                <div className={styles.skelBox} style={{ width: "60%", height: 12 }} />
                <div className={styles.skelBox} style={{ width: "40%", height: 10, marginTop: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const orders = data?.orders || data?.recentOrders || [];
  const bookings = data?.bookings || data?.recentBookings || [];
  const items = [...orders.slice(0, 4).map((o) => ({ type: "order", ...o })), ...bookings.slice(0, 4).map((b) => ({ type: "booking", ...b }))]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 8);

  if (!items.length) {
    return (
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Recent Activity</h2></div>
        <div className={styles.emptyMini}><Clock size={28} /><p>No recent activity</p></div>
      </div>
    );
  }

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <p className={styles.sectionSub}>Latest orders and bookings.</p>
        </div>
      </div>
      <div className={styles.activityList}>
        {items.map((item, idx) => (
          <motion.div
            key={item._id || idx}
            className={styles.activityItem}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <span className={`${styles.activityIcon} ${item.type === "order" ? styles.activityOrder : styles.activityBooking}`}>
              {item.type === "order" ? <ShoppingCart size={14} /> : <CalendarCheck size={14} />}
            </span>
            <div className={styles.activityContent}>
              <span className={styles.activityText}>
                {item.type === "order"
                  ? `Order #${(item._id || "").slice(-6)} — ${item.user?.name || "Guest"}`
                  : `Booking — ${item.room?.name || "Room"} — ${item.user?.name || "Guest"}`}
              </span>
              <span className={styles.activityDate}>
                {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const InventoryAnalytics = ({ data, loading }) => {
  const invData = useMemo(() => {
    if (!data) return null;
    return {
      inStock: data.inStock ?? data.in_stock ?? 0,
      lowStock: data.lowStock ?? data.low_stock ?? 0,
      outOfStock: data.outOfStock ?? data.out_of_stock ?? 0,
      total: data.total ?? data.totalProducts ?? 0,
    };
  }, [data]);

  const chartData = useMemo(() => {
    if (!invData) return [];
    return [
      { name: "In Stock", value: invData.inStock, color: "#609966" },
      { name: "Low Stock", value: invData.lowStock, color: "#d97706" },
      { name: "Out of Stock", value: invData.outOfStock, color: "#ef4444" },
    ].filter((d) => d.value > 0);
  }, [invData]);

  if (loading) {
    return (
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Inventory</h2></div>
        <SkeletonChart />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Inventory</h2></div>
        <div className={styles.emptyMini}><Package size={28} /><p>No inventory data</p></div>
      </div>
    );
  }

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Inventory Analytics</h2>
          <p className={styles.sectionSub}>Product stock levels and distribution.</p>
        </div>
      </div>
      <div className={styles.inventoryRow}>
        <div className={styles.invCards}>
          <div className={styles.invCard}>
            <span className={styles.invCardIcon} style={{ background: "rgba(96,153,102,0.12)", color: "#609966" }}>
              <CheckCircle size={18} />
            </span>
            <span className={styles.invCardValue}>{invData?.inStock ?? "—"}</span>
            <span className={styles.invCardLabel}>In Stock</span>
          </div>
          <div className={styles.invCard}>
            <span className={styles.invCardIcon} style={{ background: "rgba(245,158,11,0.1)", color: "#d97706" }}>
              <AlertCircle size={18} />
            </span>
            <span className={styles.invCardValue}>{invData?.lowStock ?? "—"}</span>
            <span className={styles.invCardLabel}>Low Stock</span>
          </div>
          <div className={styles.invCard}>
            <span className={styles.invCardIcon} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
              <XCircle size={18} />
            </span>
            <span className={styles.invCardValue}>{invData?.outOfStock ?? "—"}</span>
            <span className={styles.invCardLabel}>Out of Stock</span>
          </div>
        </div>
        <div className={styles.invChart}>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={180}>
              <RPieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(157,192,139,0.1)" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} formatter={(val) => <span style={{ color: "rgba(64,81,59,0.5)" }}>{val}</span>} />
              </RPieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyMini}><PieChart size={24} /><p>No data</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

const ErrorState = ({ message, onRetry }) => (
  <motion.div className={styles.errorState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <AlertCircle size={48} />
    <h3>Failed to load analytics</h3>
    <p>{message || "Something went wrong. Please try again."}</p>
    <motion.button className={styles.retryBtn} onClick={onRetry} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
      <RefreshCw size={16} />
      Try Again
    </motion.button>
  </motion.div>
);

const buildOverviewFromData = ({ orders, bookings, products, rooms, users }) => {
  const orderArr = Array.isArray(orders) ? orders : [];
  const bookingArr = Array.isArray(bookings) ? bookings : [];
  const productArr = Array.isArray(products) ? products : [];
  const roomArr = Array.isArray(rooms) ? rooms : [];
  const userArr = Array.isArray(users) ? users : [];

  const totalRevenue = orderArr.reduce((sum, o) => sum + (o.totalAmount || o.amount || o.total || 0), 0)
    + bookingArr.reduce((sum, b) => sum + (b.totalPrice || b.amount || 0), 0);

  return {
    revenue: { value: totalRevenue },
    orders: { value: orderArr.length },
    bookings: { value: bookingArr.length },
    customers: { value: userArr.length },
    products: { value: productArr.length },
    rooms: { value: roomArr.length },
  };
};

const AnalyticsPage = () => {
  const { token } = useAuth();
  const [period, setPeriod] = useState("monthly");
  const [overview, setOverview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const headers = { Authorization: `Bearer ${token}` };
      const [ordersRes, bookingsRes, productsRes, roomsRes, usersRes] = await Promise.allSettled([
        axios.get(ORDERS_API.ALL, { headers }),
        axios.get(BOOKINGS_API, { headers }),
        axios.get(PRODUCTS_API),
        axios.get(ROOMS_API),
        axios.get(USERS_API.ALL, { headers }),
      ]);

      const extract = (res, key) => {
        if (res.status !== "fulfilled") return [];
        const d = res.value.data;
        return Array.isArray(d) ? d : d[key] || d.data || [];
      };

      const o = extract(ordersRes, "orders");
      const b = extract(bookingsRes, "bookings");
      const p = extract(productsRes, "products");
      const r = extract(roomsRes, "rooms");
      const u = extract(usersRes, "users");

      setOrders(o);
      setBookings(b);
      setProducts(p);
      setRooms(r);
      setUsers(u);
      setOverview(buildOverviewFromData({ orders: o, bookings: b, products: p, rooms: r, users: u }));
    } catch (err) {
      setError(err.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchAll();
  }, [token, fetchAll]);

  const orderStatusData = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      const s = o.status || o.orderStatus || "Unknown";
      counts[s] = (counts[s] || 0) + 1;
    });
    return {
      trend: orders.slice(-30).reverse().reduce((acc, o) => {
        const d = o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A";
        const existing = acc.find((a) => a.period === d);
        if (existing) existing.count++;
        else acc.push({ period: d, count: 1 });
        return acc;
      }, []),
      status: Object.entries(counts).map(([name, count]) => ({ _id: name, count })),
    };
  }, [orders]);

  const bookingStatusData = useMemo(() => {
    const getStatus = (b) => {
      if (b.status === "Cancelled") return "Cancelled";
      const now = new Date();
      if (now < new Date(b.checkIn)) return "Upcoming";
      if (now > new Date(b.checkOut)) return "Completed";
      return "Ongoing";
    };
    const counts = {};
    bookings.forEach((b) => {
      const s = getStatus(b);
      counts[s] = (counts[s] || 0) + 1;
    });
    return {
      trend: bookings.slice(-30).reverse().reduce((acc, b) => {
        const d = b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A";
        const existing = acc.find((a) => a.period === d);
        if (existing) existing.count++;
        else acc.push({ period: d, count: 1 });
        return acc;
      }, []),
      status: Object.entries(counts).map(([name, count]) => ({ _id: name, count })),
    };
  }, [bookings]);

  const productAnalytics = useMemo(() => {
    return {
      topProducts: products.sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 8).map((p) => ({
        name: p.unit ? `${p.name} (${p.unit})` : p.name,
        sold: p.stock || 0,
      })),
      categoryDistribution: Object.entries(
        products.reduce((acc, p) => {
          const cat = p.category || "Uncategorized";
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {})
      ).map(([category, count]) => ({ _id: category, count })),
    };
  }, [products]);

  const roomAnalytics = useMemo(() => {
    const roomBookingCounts = {};
    bookings.forEach((b) => {
      const id = b.room?._id || b.room;
      if (id) roomBookingCounts[id] = (roomBookingCounts[id] || 0) + 1;
    });
    return {
      topRooms: rooms.map((r) => ({
        name: r.name,
        bookings: roomBookingCounts[r._id] || 0,
      })).sort((a, b) => b.bookings - a.bookings).slice(0, 8),
    };
  }, [rooms, bookings]);

  const revenueData = useMemo(() => {
    const combined = [
      ...orders.map((o) => ({ date: o.createdAt, amount: o.totalAmount || o.amount || o.total || 0 })),
      ...bookings.map((b) => ({ date: b.createdAt, amount: b.totalPrice || b.amount || 0 })),
    ].filter((d) => d.date);

    if (!combined.length) return [];

    if (period === "yearly") {
      const map = {};
      combined.forEach(({ date, amount }) => {
        const y = new Date(date).getFullYear().toString();
        map[y] = (map[y] || 0) + amount;
      });
      return Object.entries(map).map(([period, revenue]) => ({ period, revenue }));
    }

    if (period === "monthly") {
      const map = {};
      combined.forEach(({ date, amount }) => {
        const d = new Date(date);
        const key = `${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`;
        map[key] = (map[key] || 0) + amount;
      });
      return Object.entries(map).map(([period, revenue]) => ({ period, revenue }));
    }

    if (period === "weekly") {
      const map = {};
      combined.forEach(({ date, amount }) => {
        const d = new Date(date);
        const start = new Date(d);
        start.setDate(d.getDate() - d.getDay());
        const key = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
        map[key] = (map[key] || 0) + amount;
      });
      return Object.entries(map).map(([period, revenue]) => ({ period, revenue }));
    }

    const map = {};
    combined.forEach(({ date, amount }) => {
      const key = new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      map[key] = (map[key] || 0) + amount;
    });
    return Object.entries(map).map(([period, revenue]) => ({ period, revenue }));
  }, [orders, bookings, period]);

  return (
    <motion.div className={styles.analyticsPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <AnalyticsHeader
        onRefresh={() => fetchAll(true)}
        refreshing={refreshing}
        period={period}
        onPeriodChange={setPeriod}
      />

      {error ? (
        <ErrorState message={error} onRetry={fetchAll} />
      ) : (
        <motion.div className={styles.content} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <OverviewCards data={overview} loading={loading} />

          <RevenueChart data={revenueData} loading={loading} />

          <OrderAnalytics data={orderStatusData} loading={loading} />

          <BookingAnalytics data={bookingStatusData} loading={loading} />

          <ProductAnalytics data={productAnalytics} loading={loading} />

          <RoomAnalytics data={roomAnalytics} loading={loading} />

          <div className={styles.bottomRow}>
            <RecentActivity data={{ orders, bookings }} loading={loading} />
            <InventoryAnalytics data={null} loading={loading} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnalyticsPage;
