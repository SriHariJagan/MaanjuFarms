import React from "react";

const TIMELINE_ORDER = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const STATUS_META = {
  pending: { label: "Order Placed", icon: "🛒" },
  confirmed: { label: "Confirmed", icon: "✅" },
  processing: { label: "Processing", icon: "⚙️" },
  packed: { label: "Packed", icon: "📦" },
  shipped: { label: "Shipped", icon: "🚚" },
  out_for_delivery: { label: "Out for Delivery", icon: "📬" },
  delivered: { label: "Delivered", icon: "🎉" },
  cancelled: { label: "Cancelled", icon: "❌" },
  returned: { label: "Returned", icon: "↩️" },
  refunded: { label: "Refunded", icon: "💰" },
};

const OrderTimeline = ({ timeline = [], currentStatus }) => {
  const isCancelled = currentStatus === "cancelled";
  const isReturned = currentStatus === "returned" || currentStatus === "refunded";

  const getStepStatus = (stepStatus) => {
    if (isCancelled || isReturned) {
      const cancelledIdx = timeline.findIndex(
        (t) => t.status === "cancelled" || t.status === "returned"
      );
      const stepIdx = TIMELINE_ORDER.indexOf(stepStatus);
      const cancelledStep = TIMELINE_ORDER.indexOf(
        timeline[cancelledIdx]?.status === "cancelled" ? "cancelled" : "delivered"
      );
      if (isReturned && stepIdx <= cancelledStep) return "completed";
      if (stepIdx < cancelledStep) return "completed";
      if (stepIdx === cancelledStep) return "cancelled";
      return "pending";
    }

    const currentIdx = TIMELINE_ORDER.indexOf(currentStatus);
    const stepIdx = TIMELINE_ORDER.indexOf(stepStatus);

    if (stepIdx < currentIdx) return "completed";
    if (stepIdx === currentIdx) return "active";
    return "pending";
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.timelineContainer}>
        {TIMELINE_ORDER.map((status, index) => {
          const stepStatus = getStepStatus(status);
          const meta = STATUS_META[status];

          return (
            <div key={status} style={styles.stepWrapper}>
              <div style={styles.stepRow}>
                <div style={styles.iconWrapper}>
                  <div
                    style={{
                      ...styles.dot,
                      ...(stepStatus === "completed"
                        ? styles.dotCompleted
                        : stepStatus === "active"
                        ? styles.dotActive
                        : stepStatus === "cancelled"
                        ? styles.dotCancelled
                        : styles.dotPending),
                    }}
                  >
                    {stepStatus === "completed" ? (
                      <span style={styles.checkIcon}>✓</span>
                    ) : stepStatus === "cancelled" ? (
                      <span style={styles.crossIcon}>✕</span>
                    ) : (
                      <span style={styles.iconEmoji}>{meta.icon}</span>
                    )}
                  </div>
                  {index < TIMELINE_ORDER.length - 1 && (
                    <div
                      style={{
                        ...styles.line,
                        ...(stepStatus === "completed"
                          ? styles.lineCompleted
                          : stepStatus === "active"
                          ? styles.lineActive
                          : styles.linePending),
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    ...styles.labelWrapper,
                    ...(stepStatus === "active" ? styles.labelActive : {}),
                    ...(stepStatus === "completed" ? styles.labelCompleted : {}),
                    ...(stepStatus === "cancelled" ? styles.labelCancelled : {}),
                  }}
                >
                  <span style={styles.label}>{meta.label}</span>
                  {stepStatus === "active" && (
                    <span style={styles.currentBadge}>Current</span>
                  )}
                </div>
              </div>

              {stepStatus === "active" && timeline.length > 0 && (
                <div style={styles.dateWrapper}>
                  <span style={styles.dateText}>
                    {new Date(
                      timeline[timeline.length - 1]?.date || Date.now()
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {timeline[timeline.length - 1]?.notes && (
                    <span style={styles.noteText}>
                      {timeline[timeline.length - 1].notes}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isCancelled && (
        <div style={styles.cancelledBanner}>
          <span style={styles.cancelledIcon}>❌</span>
          <div>
            <strong>Order Cancelled</strong>
            {timeline.find((t) => t.status === "cancelled")?.notes && (
              <p style={styles.cancelledReason}>
                Reason: {timeline.find((t) => t.status === "cancelled").notes}
              </p>
            )}
          </div>
        </div>
      )}

      <div style={styles.historySection}>
        <h4 style={styles.historyTitle}>Status History</h4>
        {timeline.map((entry, idx) => (
          <div key={idx} style={styles.historyItem}>
            <div style={styles.historyDot} />
            <div style={styles.historyContent}>
              <span style={styles.historyStatus}>
                {STATUS_META[entry.status]?.label || entry.status}
              </span>
              <span style={styles.historyDate}>
                {new Date(entry.date).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {entry.notes && (
                <span style={styles.historyNotes}>{entry.notes}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "20px",
  },
  timelineContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
  },
  stepWrapper: {
    position: "relative",
  },
  stepRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "8px 0",
  },
  iconWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
    width: "36px",
  },
  dot: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    transition: "all 0.3s ease",
    position: "relative",
    zIndex: 2,
  },
  dotCompleted: {
    background: "#10b981",
    color: "#fff",
    boxShadow: "0 0 0 4px rgba(16,185,129,0.2)",
  },
  dotActive: {
    background: "#3b82f6",
    color: "#fff",
    boxShadow: "0 0 0 4px rgba(59,130,246,0.25)",
    animation: "pulse 2s infinite",
  },
  dotCancelled: {
    background: "#ef4444",
    color: "#fff",
    boxShadow: "0 0 0 4px rgba(239,68,68,0.2)",
  },
  dotPending: {
    background: "#e5e7eb",
    color: "#9ca3af",
  },
  checkIcon: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  crossIcon: {
    fontSize: "12px",
    fontWeight: "bold",
  },
  iconEmoji: {
    fontSize: "14px",
    lineHeight: 1,
  },
  line: {
    width: "2px",
    flex: 1,
    minHeight: "24px",
    marginTop: "4px",
  },
  lineCompleted: {
    background: "linear-gradient(to bottom, #10b981, #10b981)",
  },
  lineActive: {
    background: "linear-gradient(to bottom, #3b82f6, #e5e7eb)",
  },
  linePending: {
    background: "#e5e7eb",
  },
  labelWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingTop: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151",
  },
  labelActive: {
    fontWeight: 700,
  },
  labelCompleted: {
    color: "#065f46",
  },
  labelCancelled: {
    color: "#991b1b",
  },
  currentBadge: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#3b82f6",
    background: "#dbeafe",
    padding: "2px 8px",
    borderRadius: "999px",
  },
  dateWrapper: {
    marginLeft: "48px",
    marginTop: "-4px",
    marginBottom: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  dateText: {
    fontSize: "12px",
    color: "#6b7280",
  },
  noteText: {
    fontSize: "12px",
    color: "#9ca3af",
    fontStyle: "italic",
  },
  cancelledBanner: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "16px",
    padding: "12px 16px",
    background: "#fef2f2",
    borderRadius: "8px",
    border: "1px solid #fecaca",
  },
  cancelledIcon: {
    fontSize: "20px",
  },
  cancelledReason: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#6b7280",
  },
  historySection: {
    marginTop: "24px",
    padding: "16px",
    background: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  historyTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    margin: "0 0 12px",
  },
  historyItem: {
    display: "flex",
    gap: "12px",
    padding: "8px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  historyDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#d1d5db",
    marginTop: "6px",
    flexShrink: 0,
  },
  historyContent: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  historyStatus: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },
  historyDate: {
    fontSize: "11px",
    color: "#9ca3af",
  },
  historyNotes: {
    fontSize: "12px",
    color: "#6b7280",
  },
};

export default OrderTimeline;
