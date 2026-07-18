import React from "react";

const STATUS_STYLES = {
  pending: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b", label: "Pending" },
  confirmed: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6", label: "Confirmed" },
  processing: { bg: "#e0e7ff", text: "#3730a3", dot: "#6366f1", label: "Processing" },
  packed: { bg: "#ede9fe", text: "#5b21b6", dot: "#8b5cf6", label: "Packed" },
  shipped: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6", label: "Shipped" },
  out_for_delivery: { bg: "#cffafe", text: "#155e75", dot: "#06b6d4", label: "Out for Delivery" },
  delivered: { bg: "#d1fae5", text: "#065f46", dot: "#10b981", label: "Delivered" },
  cancelled: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444", label: "Cancelled" },
  returned: { bg: "#ffedd5", text: "#9a3412", dot: "#f97316", label: "Returned" },
  refunded: { bg: "#f3f4f6", text: "#4b5563", dot: "#9ca3af", label: "Refunded" },
  payment_failed: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444", label: "Payment Failed" },
  paid: { bg: "#d1fae5", text: "#065f46", dot: "#10b981", label: "Paid" },
  failed: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444", label: "Failed" },
};

const StatusBadge = ({ status, size = "md" }) => {
  const config = STATUS_STYLES[status] || { bg: "#f3f4f6", text: "#374151", dot: "#6b7280", label: status };

  const sizeStyles = size === "sm"
    ? { padding: "2px 8px", fontSize: "11px", gap: "4px" }
    : size === "lg"
    ? { padding: "6px 16px", fontSize: "14px", gap: "8px" }
    : { padding: "4px 12px", fontSize: "12px", gap: "6px" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: sizeStyles.gap,
        padding: sizeStyles.padding,
        borderRadius: "999px",
        fontSize: sizeStyles.fontSize,
        fontWeight: 600,
        background: config.bg,
        color: config.text,
        whiteSpace: "nowrap",
        letterSpacing: "0.02em",
        textTransform: "capitalize",
      }}
    >
      <span
        style={{
          width: size === "sm" ? 6 : size === "lg" ? 10 : 8,
          height: size === "sm" ? 6 : size === "lg" ? 10 : 8,
          borderRadius: "50%",
          background: config.dot,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
};

export default StatusBadge;
