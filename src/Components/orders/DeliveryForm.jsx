import React, { useState } from "react";
import { Truck, PackageSearch, MapPin, Calendar, FileText, Save, X } from "lucide-react";

const DeliveryForm = ({ order, onSave, onClose }) => {
  const [form, setForm] = useState({
    partner: order?.delivery?.partner || "",
    trackingNumber: order?.delivery?.trackingNumber || "",
    trackingUrl: order?.delivery?.trackingUrl || "",
    estimatedDelivery: order?.delivery?.estimatedDelivery
      ? new Date(order.delivery.estimatedDelivery).toISOString().split("T")[0]
      : "",
    shippedDate: order?.delivery?.shippedDate
      ? new Date(order.delivery.shippedDate).toISOString().split("T")[0]
      : "",
    notes: order?.delivery?.notes || "",
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.partner.trim()) errs.partner = "Courier partner is required";
    if (form.trackingUrl && !form.trackingUrl.startsWith("http")) errs.trackingUrl = "Must be a valid URL";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      console.error("Delivery save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "8px 12px",
    border: `1px solid ${hasError ? "#ef4444" : "#d1d5db"}`,
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    background: "#fff",
  });

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <Truck size={20} color="#3b82f6" />
            <h3 style={styles.title}>Delivery Details</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.orderInfo}>
          <span style={styles.orderLabel}>Order #</span>
          <span style={styles.orderId}>{order?._id?.slice(-8) || "N/A"}</span>
          <span style={styles.orderStatus}>{order?.status}</span>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>
              <Truck size={14} /> Courier Partner <span style={styles.required}>*</span>
            </label>
            <input
              name="partner"
              value={form.partner}
              onChange={handleChange}
              placeholder="e.g., Delhivery, Blue Dart, DTDC"
              style={inputStyle(errors.partner)}
            />
            {errors.partner && <span style={styles.error}>{errors.partner}</span>}
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>
                <PackageSearch size={14} /> Tracking Number
              </label>
              <input
                name="trackingNumber"
                value={form.trackingNumber}
                onChange={handleChange}
                placeholder="Tracking ID"
                style={inputStyle()}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>
                <MapPin size={14} /> Tracking URL
              </label>
              <input
                name="trackingUrl"
                value={form.trackingUrl}
                onChange={handleChange}
                placeholder="https://..."
                style={inputStyle(errors.trackingUrl)}
              />
              {errors.trackingUrl && <span style={styles.error}>{errors.trackingUrl}</span>}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>
                <Calendar size={14} /> Estimated Delivery
              </label>
              <input
                type="date"
                name="estimatedDelivery"
                value={form.estimatedDelivery}
                onChange={handleChange}
                style={inputStyle()}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>
                <Calendar size={14} /> Shipped Date
              </label>
              <input
                type="date"
                name="shippedDate"
                value={form.shippedDate}
                onChange={handleChange}
                style={inputStyle()}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              <FileText size={14} /> Delivery Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Additional delivery instructions..."
              rows={2}
              style={{ ...inputStyle(), resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={styles.saveBtn}>
              <Save size={16} />
              {saving ? "Saving..." : "Save Delivery Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    background: "#fff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "560px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
  },
  closeBtn: {
    border: "none",
    background: "#f3f4f6",
    borderRadius: "8px",
    padding: "6px",
    cursor: "pointer",
    display: "flex",
    color: "#6b7280",
  },
  orderInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 24px",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  orderLabel: {
    fontSize: "12px",
    color: "#6b7280",
  },
  orderId: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#111827",
  },
  orderStatus: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#3b82f6",
    background: "#dbeafe",
    padding: "2px 8px",
    borderRadius: "999px",
    textTransform: "capitalize",
  },
  form: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  required: {
    color: "#ef4444",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  error: {
    fontSize: "11px",
    color: "#ef4444",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "8px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
  cancelBtn: {
    padding: "10px 20px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#fff",
    color: "#374151",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  saveBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 24px",
    border: "none",
    borderRadius: "8px",
    background: "#3b82f6",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

export default DeliveryForm;
