import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Plus, Edit, AlertCircle, RefreshCw,
  Building2, BedDouble, Calendar
} from "lucide-react";
import { useAuth } from "../../Store/useContext";
import { ROOMS_API } from "../../urls";
import AdminModal from "../../Components/Admin/AdminModal";
import ImageUploader from "../../Components/Admin/ImageUploader";
import ConfirmDialog from "../../Components/Admin/ConfirmDialog";
import "./AdminVillas.css";

const STATUS_COLORS = {
  Available: { bg: "rgba(96, 153, 102, 0.1)", color: "#609966", dot: "#609966" },
  Booked: { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444", dot: "#ef4444" },
  Maintenance: { bg: "rgba(245, 158, 11, 0.1)", color: "#d97706", dot: "#d97706" },
};

const UPLOAD_API = ROOMS_API;

const AdminVillas = () => {
  const { token } = useAuth();
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", type: "", price: "", status: "Available", image: ""
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchVillas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${ROOMS_API}?category=villa`);
      const d = res.data;
      setVillas(d?.rooms || (Array.isArray(d) ? d : []));
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to load villas");
      toast.error("Failed to load villas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVillas(); }, [fetchVillas]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", description: "", type: "", price: "", status: "Available", image: "" });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (villa) => {
    setEditing(villa);
    setForm({
      name: villa.name || "",
      description: villa.description || "",
      type: villa.type || "",
      price: villa.price?.toString() || "",
      status: villa.status || "Available",
      image: villa.image || "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.type.trim()) errs.type = "Type is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = "Valid price required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        type: form.type.trim(),
        price: Number(form.price),
        status: form.status,
        image: form.image,
        category: "villa",
      };
      if (editing) {
        const res = await axios.put(`${ROOMS_API}/${editing._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVillas((prev) =>
          prev.map((v) => (v._id === editing._id ? res.data.room || res.data : v))
        );
        toast.success("Villa updated");
      } else {
        const res = await axios.post(ROOMS_API, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVillas((prev) => [...prev, res.data.room || res.data]);
        toast.success("Villa added");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message || "Failed to save villa");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (villa, newStatus) => {
    const prev = villa.status;
    setVillas((prevV) =>
      prevV.map((v) => (v._id === villa._id ? { ...v, status: newStatus } : v))
    );
    try {
      await axios.put(
        `${ROOMS_API}/${villa._id}`,
        { status: newStatus, category: "villa" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
    } catch (err) {
      setVillas((prevV) =>
        prevV.map((v) => (v._id === villa._id ? { ...v, status: prev } : v))
      );
      toast.error(err.response?.data?.msg || "Failed to update status");
    }
  };

  const confirmDelete = (villa) => setDeleteTarget(villa);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axios.delete(`${ROOMS_API}/${deleteTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVillas((prev) => prev.filter((v) => v._id !== deleteTarget._id));
      toast.success("Villa deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete villa");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-villas">
        <div className="admin-villas-header">
          <h2>Villas & Stays</h2>
        </div>
        <div className="admin-villas-grid">
          {[1,2,3].map((i) => (
            <div key={i} className="admin-villa-skeleton">
              <div className="admin-skeleton admin-skeleton--villa-img" />
              <div className="admin-villa-skeleton-body">
                <div className="admin-skeleton admin-skeleton--villa-title" />
                <div className="admin-skeleton admin-skeleton--villa-text" />
                <div className="admin-skeleton admin-skeleton--villa-text" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-villas">
        <div className="admin-error-state">
          <AlertCircle size={48} />
          <h3>Failed to load villas</h3>
          <p>{error}</p>
          <button className="admin-btn admin-btn--primary" onClick={fetchVillas}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-villas">
      <div className="admin-villas-header">
        <div>
          <h2>Villas & Stays</h2>
          <p className="admin-villas-subtitle">Manage villa listings, availability, and pricing</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>
          <Plus size={16} /> Add New Villa
        </button>
      </div>

      {villas.length === 0 ? (
        <div className="admin-empty-state">
          <Building2 size={48} />
          <h3>No villas yet</h3>
          <p>Start by adding your first villa listing</p>
          <button className="admin-btn admin-btn--primary" onClick={openAdd}>
            <Plus size={16} /> Add New Villa
          </button>
        </div>
      ) : (
        <div className="admin-villas-grid">
          {villas.map((villa) => {
            const sc = STATUS_COLORS[villa.status] || STATUS_COLORS.Available;
            return (
              <div key={villa._id} className="admin-villa-card">
                <div className="admin-villa-img">
                  {villa.image ? (
                    <img
                      src={villa.image}
                      alt={villa.name}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <Building2 size={32} />
                  )}
                </div>
                <div className="admin-villa-body">
                  <div className="admin-villa-head">
                    <h3 className="admin-villa-name">{villa.name}</h3>
                    <span
                      className="admin-villa-status"
                      style={{ background: sc.bg, color: sc.color }}
                    >
                      <span className="admin-villa-status-dot" style={{ background: sc.dot }} />
                      {villa.status || "Available"}
                    </span>
                  </div>
                  <p className="admin-villa-desc">{villa.description}</p>
                  <div className="admin-villa-meta">
                    <span className="admin-villa-type">{villa.type}</span>
                    <span className="admin-villa-price">
                      ₹{villa.price?.toLocaleString()}<small>/night</small>
                    </span>
                  </div>
                  <div className="admin-villa-actions">
                    <select
                      className="admin-villa-status-select"
                      value={villa.status || "Available"}
                      onChange={(e) => handleStatusChange(villa, e.target.value)}
                    >
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                    <button
                      className="admin-villa-action-btn"
                      title="Check Availability"
                      onClick={() => toast.info("Availability calendar coming soon")}
                    >
                      <Calendar size={14} />
                      <span>Availability</span>
                    </button>
                    <button
                      className="admin-villa-action-btn"
                      title="Edit"
                      onClick={() => openEdit(villa)}
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Villa" : "Add New Villa"}
        size="lg"
      >
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Image</label>
              <ImageUploader
                currentImage={form.image}
                onUploadComplete={(url) => setForm((f) => ({ ...f, image: url }))}
                onRemove={() => setForm((f) => ({ ...f, image: "" }))}
                endpoint={UPLOAD_API}
                token={token}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Name *</label>
              <input
                className={`admin-input ${formErrors.name ? "admin-input--error" : ""}`}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Villa name"
              />
              {formErrors.name && <span className="admin-form-error">{formErrors.name}</span>}
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Type *</label>
              <input
                className={`admin-input ${formErrors.type ? "admin-input--error" : ""}`}
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                placeholder="e.g. Premium Villa, Cottage"
              />
              {formErrors.type && <span className="admin-form-error">{formErrors.type}</span>}
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Price per Night (₹) *</label>
              <input
                className={`admin-input ${formErrors.price ? "admin-input--error" : ""}`}
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0"
              />
              {formErrors.price && <span className="admin-form-error">{formErrors.price}</span>}
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Status</label>
              <select
                className="admin-input"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea
              className="admin-input admin-textarea"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Villa description"
              rows={3}
            />
          </div>
          <div className="admin-form-actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
              {submitting ? "Saving..." : editing ? "Update Villa" : "Add Villa"}
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Villa"
        message={`Are you sure you want to delete "${deleteTarget?.name || "this villa"}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default AdminVillas;
