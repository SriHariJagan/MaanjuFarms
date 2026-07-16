import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Plus, Search, Edit, Trash2, ChevronUp, ChevronDown,
  Package, AlertCircle, RefreshCw
} from "lucide-react";
import { useAuth } from "../../Store/useContext";
import { PRODUCTS_API } from "../../urls";
import AdminModal from "../../Components/Admin/AdminModal";
import ImageUploader from "../../Components/Admin/ImageUploader";
import ConfirmDialog from "../../Components/Admin/ConfirmDialog";
import "./AdminProducts.css";

const UPLOAD_API = PRODUCTS_API;

const AdminProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "", price: "", stock: "", description: "", image: ""
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(PRODUCTS_API);
      const d = res.data;
      setProducts(Array.isArray(d) ? d : (d?.products || []));
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to load products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["All", ...cats.sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "All") {
      list = list.filter((p) => p.category === categoryFilter);
    }
    if (sortKey) {
      list.sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [products, search, categoryFilter, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", category: "", price: "", stock: "", description: "", image: "" });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      description: product.description || "",
      image: product.image || "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.category.trim()) errors.category = "Category is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      errors.price = "Valid price required";
    if (form.stock === "" || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      errors.stock = "Valid stock quantity required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description.trim(),
        image: form.image,
      };
      if (editing) {
        const res = await axios.put(`${PRODUCTS_API}/${editing._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts((prev) =>
          prev.map((p) => (p._id === editing._id ? res.data.product || res.data : p))
        );
        toast.success("Product updated");
      } else {
        const res = await axios.post(PRODUCTS_API, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts((prev) => [...prev, res.data.product || res.data]);
        toast.success("Product added");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (product) => {
    setDeleteTarget(product);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axios.delete(`${PRODUCTS_API}/${deleteTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success("Product deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const SortIcon = ({ active, dir }) => {
    if (!active) return null;
    return dir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  if (loading) {
    return (
      <div className="admin-products">
        <div className="admin-section-header">
          <h2>Products</h2>
        </div>
        <div className="admin-skeleton-list">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="admin-skeleton-row">
              <div className="admin-skeleton admin-skeleton--thumb" />
              <div className="admin-skeleton admin-skeleton--text" />
              <div className="admin-skeleton admin-skeleton--text" />
              <div className="admin-skeleton admin-skeleton--text" />
              <div className="admin-skeleton admin-skeleton--text" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-products">
        <div className="admin-error-state">
          <AlertCircle size={48} />
          <h3>Failed to load products</h3>
          <p>{error}</p>
          <button className="admin-btn admin-btn--primary" onClick={fetchProducts}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <div className="admin-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="admin-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty-state">
          <Package size={48} />
          <h3>No products found</h3>
          <p>{search || categoryFilter !== "All" ? "Try a different filter" : "Start by adding your first product"}</p>
          {!search && categoryFilter === "All" && (
            <button className="admin-btn admin-btn--primary" onClick={openAdd}>
              <Plus size={16} /> Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th-thumb">Image</th>
                <th>Name</th>
                <th>Category</th>
                <th className="admin-th-sort" onClick={() => handleSort("price")}>
                  Price <SortIcon active={sortKey === "price"} dir={sortDir} />
                </th>
                <th className="admin-th-sort" onClick={() => handleSort("stock")}>
                  Stock <SortIcon active={sortKey === "stock"} dir={sortDir} />
                </th>
                <th>Status</th>
                <th className="admin-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="admin-product-thumb">
                      {p.image ? (
                        <img src={p.image} alt={p.name} onError={(e) => { e.target.style.display = "none"; }} />
                      ) : (
                        <Package size={18} />
                      )}
                    </div>
                  </td>
                  <td className="admin-cell-name">{p.name}</td>
                  <td><span className="admin-badge-tag">{p.category}</span></td>
                  <td className="admin-cell-price">₹{p.price?.toLocaleString()}</td>
                  <td>
                    <span className={`admin-stock-badge ${p.stock > 0 ? "admin-stock-badge--ok" : "admin-stock-badge--out"}`}>
                      {p.stock > 0 ? p.stock : "Out"}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-status-dot ${p.stock > 0 ? "admin-status-dot--active" : "admin-status-dot--inactive"}`} />
                  </td>
                  <td>
                    <div className="admin-action-btns">
                      <button className="admin-action-btn" title="Edit" onClick={() => openEdit(p)}>
                        <Edit size={15} />
                      </button>
                      <button className="admin-action-btn admin-action-btn--danger" title="Delete" onClick={() => confirmDelete(p)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Product" : "Add Product"} size="lg">
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
                name="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Product name"
              />
              {formErrors.name && <span className="admin-form-error">{formErrors.name}</span>}
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Category *</label>
              <input
                className={`admin-input ${formErrors.category ? "admin-input--error" : ""}`}
                name="category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Dairy, Honey"
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                {categories.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {formErrors.category && <span className="admin-form-error">{formErrors.category}</span>}
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Price (₹) *</label>
              <input
                className={`admin-input ${formErrors.price ? "admin-input--error" : ""}`}
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0.00"
              />
              {formErrors.price && <span className="admin-form-error">{formErrors.price}</span>}
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Stock *</label>
              <input
                className={`admin-input ${formErrors.stock ? "admin-input--error" : ""}`}
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                placeholder="0"
              />
              {formErrors.stock && <span className="admin-form-error">{formErrors.stock}</span>}
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea
              className="admin-input admin-textarea"
              name="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Product description"
              rows={3}
            />
          </div>
          <div className="admin-form-actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
              {submitting ? "Saving..." : editing ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete ${deleteTarget?.name ? `"${deleteTarget.name}"` : "this product"}?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default AdminProducts;
