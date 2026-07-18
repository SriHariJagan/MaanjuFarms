import React from "react";
import { Package, Clock, CheckCircle, XCircle, Truck, TrendingUp, DollarSign, Calendar } from "lucide-react";

const STAT_CARDS = [
  { key: "totalOrders", label: "Total Orders", icon: Package, color: "#3b82f6", bg: "#dbeafe" },
  { key: "todayOrders", label: "Today's Orders", icon: Calendar, color: "#8b5cf6", bg: "#ede9fe" },
  { key: "pending", label: "Pending", icon: Clock, color: "#f59e0b", bg: "#fef3c7" },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle, color: "#3b82f6", bg: "#dbeafe" },
  { key: "processing", label: "Processing", icon: Truck, color: "#6366f1", bg: "#e0e7ff" },
  { key: "packed", label: "Packed", icon: Package, color: "#8b5cf6", bg: "#ede9fe" },
  { key: "shipped", label: "Shipped", icon: Truck, color: "#3b82f6", bg: "#dbeafe" },
  { key: "outForDelivery", label: "Out for Delivery", icon: Truck, color: "#06b6d4", bg: "#cffafe" },
  { key: "delivered", label: "Delivered", icon: CheckCircle, color: "#10b981", bg: "#d1fae5" },
  { key: "cancelled", label: "Cancelled", icon: XCircle, color: "#ef4444", bg: "#fee2e2" },
  { key: "totalRevenue", label: "Revenue", icon: DollarSign, color: "#059669", bg: "#d1fae5", isCurrency: true },
  { key: "avgOrderValue", label: "Avg Order Value", icon: TrendingUp, color: "#7c3aed", bg: "#ede9fe", isCurrency: true },
];

const OrderStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div style={styles.grid}>
        {STAT_CARDS.slice(0, 4).map((_, i) => (
          <div key={i} style={{ ...styles.card, ...styles.skeleton }}>
            <div style={{ ...styles.skeletonBar, width: "40%" }} />
            <div style={{ ...styles.skeletonBar, width: "60%", marginTop: 8 }} />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div style={styles.grid}>
      {STAT_CARDS.map((card) => {
        const value = stats[card.key];
        if (value === undefined) return null;

        const Icon = card.icon;

        return (
          <div key={card.key} style={styles.card}>
            <div style={{ ...styles.iconWrap, background: card.bg }}>
              <Icon size={20} color={card.color} />
            </div>
            <div style={styles.info}>
              <span style={styles.label}>{card.label}</span>
              <span style={styles.value}>
                {card.isCurrency
                  ? `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                  : Number(value).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px",
    marginBottom: "24px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default",
  },
  iconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: 0,
  },
  label: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  value: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.2,
  },
  skeleton: {
    padding: "20px",
  },
  skeletonBar: {
    height: "14px",
    borderRadius: "4px",
    background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
};

export default OrderStats;
