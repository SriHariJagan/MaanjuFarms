import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Plus,
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Trash2,
  Package,
  ClipboardList,
  IndianRupee,
  CalendarDays,
  ArrowLeft,
  AlertCircle,
  Sprout,
  Tag,
  Layers,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { useAuth } from "../../../Store/useContext";
import { PRODUCTS_ENDPOINTS, IMAGE_BASE } from "../../../urls";
import { getImageUrl } from "../../../utils/getImageUrl ";
import styles from "./ProductsPage.module.css";

// ─── Stock Status Config ────────────────────────────────────
const STOCK_STATUS = {
  "In Stock": { bg: "rgba(96,153,102,0.12)", text: "#609966" },
  "Low Stock": { bg: "rgba(245,158,11,0.1)", text: "#d97706" },
  "Out of Stock": { bg: "rgba(239,68,68,0.1)", text: "#ef4444" },
};

const getStockStatus = (stock) => {
  if (stock <= 0) return "Out of Stock";
  if (stock <= 10) return "Low Stock";
  return "In Stock";
};

// ─── ProductStatusBadge ─────────────────────────────────────
const ProductStatusBadge = ({ stock }) => {
  const status = getStockStatus(stock);
  const config = STOCK_STATUS[status];
  return (
    <span className={styles.statusBadge} style={{ background: config.bg, color: config.text }}>
      <span className={styles.statusDot} style={{ background: config.text }} />
      {status}
    </span>
  );
};

// ─── ProductKPICards ─────────────────────────────────────────
const KPI_CARDS = [
  { key: "total", label: "Total Products", icon: Package, color: "#609966" },
  { key: "active", label: "Active Products", icon: Sprout, color: "#40513B" },
  { key: "lowStock", label: "Low Stock", icon: AlertCircle, color: "#d97706" },
  { key: "outOfStock", label: "Out of Stock", icon: X, color: "#ef4444" },
  { key: "categories", label: "Categories", icon: Layers, color: "#2563eb" },
];

const ProductKPICards = ({ products }) => {
  const counts = useMemo(() => {
    const raw = products || [];
    const cats = new Set(raw.map((p) => p.category).filter(Boolean));
    return {
      total: raw.length,
      active: raw.filter((p) => p.stock > 0).length,
      lowStock: raw.filter((p) => p.stock > 0 && p.stock <= 10).length,
      outOfStock: raw.filter((p) => p.stock <= 0).length,
      categories: cats.size,
    };
  }, [products]);

  return (
    <div className={styles.kpiGrid}>
      {KPI_CARDS.map((card, i) => (
        <motion.div
          key={card.key}
          className={styles.kpiCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(64,81,59,0.1)" }}
        >
          <div className={styles.kpiTop}>
            <span className={styles.kpiIcon} style={{ background: `${card.color}14`, color: card.color }}>
              <card.icon size={18} />
            </span>
          </div>
          <div className={styles.kpiValue}>{counts[card.key]}</div>
          <div className={styles.kpiLabel}>{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// ─── ProductsHeader ─────────────────────────────────────────
const ProductsHeader = ({ onRefresh, refreshing, onAddProduct }) => (
  <motion.div
    className={styles.pageHeader}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <div>
      <h1 className={styles.pageTitle}>Products</h1>
      <p className={styles.pageSubtitle}>Manage all organic products available in the store.</p>
    </div>
    <div className={styles.headerActions}>
      <motion.button
        className={`${styles.headerBtn} ${styles.addBtn}`}
        onClick={onAddProduct}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <Plus size={16} />
        <span>Add Product</span>
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

// ─── ProductsFilters ─────────────────────────────────────────
const ProductsFilters = ({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  stockFilter,
  onStockFilterChange,
  sortBy,
  onSortChange,
  onReset,
  resultCount,
  categories,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <motion.div
      className={styles.filtersWrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <div className={styles.filtersTop}>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => onSearchChange("")}>
              <X size={14} />
            </button>
          )}
        </div>

        <motion.button
          className={`${styles.filterToggle} ${showFilters ? styles.filterToggleActive : ""}`}
          onClick={() => setShowFilters(!showFilters)}
          whileTap={{ scale: 0.95 }}
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          <ChevronDown size={14} className={showFilters ? styles.chevronUp : ""} />
        </motion.button>

        <div className={styles.resultCount}>{resultCount} products</div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className={styles.filtersBody}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label>Category</label>
                <select value={categoryFilter} onChange={(e) => onCategoryFilterChange(e.target.value)}>
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Stock Status</label>
                <select value={stockFilter} onChange={(e) => onStockFilterChange(e.target.value)}>
                  <option value="all">All Stock</option>
                  <option value="in">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Sort By</label>
                <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="stock-high">Stock: High to Low</option>
                  <option value="stock-low">Stock: Low to High</option>
                  <option value="alpha">Alphabetical (A-Z)</option>
                </select>
              </div>

              <motion.button
                className={styles.resetBtn}
                onClick={onReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <X size={14} />
                Reset Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Product Image Preview ───────────────────────────────────
const ProductImage = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  const url = getImageUrl(src);
  if (!url || error) {
    return (
      <div className={`${styles.productImgPlaceholder} ${className || ""}`}>
        <ImageIcon size={20} />
      </div>
    );
  }
  return <img src={url} alt={alt || "Product"} className={className || ""} onError={() => setError(true)} />;
};

// ─── Products Grid ───────────────────────────────────────────
const ITEMS_PER_PAGE = 12;

const ProductsGrid = ({
  products,
  onViewDetails,
  onEdit,
  onDelete,
  loading,
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const paginated = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [products.length, page, totalPages]);

  if (loading) {
    return (
      <div className={styles.gridWrapper}>
        <div className={styles.productGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skelImage} />
              <div className={styles.skelBody}>
                <div className={styles.skelBox} style={{ width: "70%", height: 14 }} />
                <div className={styles.skelBox} style={{ width: "40%", height: 12 }} />
                <div className={styles.skelRow}>
                  <div className={styles.skelBox} style={{ width: "30%", height: 14 }} />
                  <div className={styles.skelBox} style={{ width: "25%", height: 20, borderRadius: 100 }} />
                </div>
                <div className={styles.skelActions}>
                  <div className={styles.skelBox} style={{ width: 28, height: 28, borderRadius: 8 }} />
                  <div className={styles.skelBox} style={{ width: 28, height: 28, borderRadius: 8 }} />
                  <div className={styles.skelBox} style={{ width: 28, height: 28, borderRadius: 8 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        className={styles.emptyState}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.emptyIcon}>
          <Package size={48} />
        </div>
        <h3 className={styles.emptyTitle}>No Products Found</h3>
        <p className={styles.emptyText}>No products match your current filters. Try adjusting your search or filter criteria.</p>
      </motion.div>
    );
  }

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.gridInfo}>
        <span className={styles.gridInfoText}>
          Showing <strong>{(page - 1) * ITEMS_PER_PAGE + 1}</strong>–<strong>{Math.min(page * ITEMS_PER_PAGE, products.length)}</strong> of <strong>{products.length}</strong> products
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div className={styles.productGrid}>
          {paginated.map((product) => (
            <motion.div
              key={product._id}
              className={styles.productCard}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(64,81,59,0.12)" }}
            >
              <div className={styles.cardImageWrap}>
                <ProductImage src={product.image} alt={product.name} className={styles.cardImage} />
                <div className={styles.cardBadge}>
                  <ProductStatusBadge stock={product.stock} />
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardCategory}>
                  <Tag size={11} />
                  {product.category || "Uncategorized"}
                </div>

                <h3 className={styles.cardName}>{product.name}</h3>

                <div className={styles.cardMeta}>
                  <span className={styles.cardPrice}>
                    <IndianRupee size={12} />
                    {(product.price || 0).toLocaleString()}{product.unit ? `/${product.unit}` : ""}
                  </span>
                  <span className={styles.cardStock}>
                    <Package size={12} />
                    {product.stock ?? 0} in stock
                  </span>
                </div>

                <div className={styles.cardDate}>
                  <CalendarDays size={11} />
                  {product.createdAt
                    ? new Date(product.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "—"}
                </div>

                <div className={styles.cardActions}>
                  <motion.button
                    className={styles.cardActionBtn}
                    onClick={() => onViewDetails(product)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    title="View Details"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </motion.button>
                  <motion.button
                    className={styles.cardActionBtn}
                    onClick={() => onEdit(product)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    title="Edit Product"
                  >
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </motion.button>
                  <motion.button
                    className={`${styles.cardActionBtn} ${styles.cardActionDanger}`}
                    onClick={() => onDelete(product)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    title="Delete Product"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Page {page} of {totalPages}
          </div>
          <div className={styles.paginationControls}>
            <motion.button
              className={styles.pageBtn}
              onClick={() => setPage(1)}
              disabled={page === 1}
              whileTap={{ scale: 0.95 }}
              title="First page"
            >
              <span className={styles.pageBtnIcon}>{`\u00ab`}</span>
            </motion.button>
            <motion.button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              whileTap={{ scale: 0.95 }}
              title="Previous page"
            >
              <ChevronLeft size={15} />
            </motion.button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className={styles.pageEllipsis}>...</span>}
                    <motion.button
                      className={`${styles.pageBtn} ${styles.pageNum} ${p === page ? styles.pageBtnActive : ""}`}
                      onClick={() => setPage(p)}
                      whileTap={{ scale: 0.95 }}
                    >
                      {p}
                    </motion.button>
                  </React.Fragment>
                ))}
            </div>
            <motion.button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              whileTap={{ scale: 0.95 }}
              title="Next page"
            >
              <ChevronRight size={15} />
            </motion.button>
            <motion.button
              className={styles.pageBtn}
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              whileTap={{ scale: 0.95 }}
              title="Last page"
            >
              <span className={styles.pageBtnIcon}>{`\u00bb`}</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ProductDrawer ───────────────────────────────────────────
const ProductDrawer = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <motion.div
      className={styles.drawerOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.drawer}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.drawerHeader}>
          <button className={styles.drawerClose} onClick={onClose}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className={styles.drawerTitle}>Product Details</h2>
            <span className={styles.drawerSub}>{product.name}</span>
          </div>
          <ProductStatusBadge stock={product.stock} />
        </div>

        <div className={styles.drawerBody}>
          {/* Product Image */}
          <section className={styles.drawerSection}>
            <div className={styles.drawerImageWrap}>
              <ProductImage src={product.image} alt={product.name} className={styles.drawerImage} />
            </div>
          </section>

          {/* Basic Info */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Basic Information</h3>
            <div className={styles.drawerInfoGrid}>
              <div className={styles.drawerInfoItem}>
                <Tag size={15} />
                <div>
                  <label>Name</label>
                  <p>{product.name}</p>
                </div>
              </div>
              <div className={styles.drawerInfoItem}>
                <Layers size={15} />
                <div>
                  <label>Category</label>
                  <p>{product.category || "Uncategorized"}</p>
                </div>
              </div>
              <div className={styles.drawerInfoItem}>
                <IndianRupee size={15} />
                <div>
                  <label>Price</label>
                  <p>₹{(product.price || 0).toLocaleString()}{product.unit ? `/${product.unit}` : ""}</p>
                </div>
              </div>
              <div className={styles.drawerInfoItem}>
                <Package size={15} />
                <div>
                  <label>Current Stock</label>
                  <p>{product.stock ?? 0} units</p>
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          {product.description && (
            <section className={styles.drawerSection}>
              <h3 className={styles.drawerSectionTitle}>Description</h3>
              <p className={styles.drawerDescription}>{product.description}</p>
            </section>
          )}

          {/* Dates */}
          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Timeline</h3>
            <div className={styles.drawerInfoGrid}>
              {product.createdAt && (
                <div className={styles.drawerInfoItem}>
                  <CalendarDays size={15} />
                  <div>
                    <label>Created At</label>
                    <p>{new Date(product.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {product.updatedAt && (
                <div className={styles.drawerInfoItem}>
                  <CalendarDays size={15} />
                  <div>
                    <label>Updated At</label>
                    <p>{new Date(product.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── ProductModal (Add / Edit) ───────────────────────────────
const INITIAL_FORM = { name: "", description: "", category: "", price: "", stock: "", unit: "" };

const ProductModal = ({ product, onClose, onSubmit, submitting }) => {
  const isEdit = !!product;
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        unit: product.unit || "",
      });
      if (product.image) {
        setImagePreview(getImageUrl(product.image));
      }
    } else {
      setForm(INITIAL_FORM);
      setImageFile(null);
      setImagePreview(null);
    }
  }, [product]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("unit", form.unit);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    onSubmit(formData, isEdit);
  };

  const dirty = form.name !== (product?.name || "")
    || form.description !== (product?.description || "")
    || form.category !== (product?.category || "")
    || form.price !== (product?.price?.toString() || "")
    || form.stock !== (product?.stock?.toString() || "")
    || form.unit !== (product?.unit || "")
    || !!imageFile;

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>{isEdit ? "Edit Product" : "Add Product"}</h2>
            <p className={styles.modalSub}>{isEdit ? "Update product details." : "Add a new organic product to the store."}</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Organic Honey"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category *</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Grocery"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Unit</label>
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className={styles.formSelect}
                >
                  <option value="">None</option>
                  <option value="kg">Kilogram</option>
                  <option value="liter">Liter</option>
                  <option value="piece">Piece</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Product description..."
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Product Image</label>
              <div className={styles.imageUploadArea}>
                {imagePreview ? (
                  <div className={styles.imagePreviewWrap}>
                    <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                    <button
                      type="button"
                      className={styles.imageRemove}
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className={styles.imageUploadLabel}>
                    <Upload size={20} />
                    <span>Click to upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <motion.button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting || !form.name || !form.price || !dirty}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {submitting ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Product" : "Add Product")}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── DeleteProductDialog ─────────────────────────────────────
const DeleteProductDialog = ({ product, onClose, onConfirm, deleting }) => {
  if (!product) return null;

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.deleteDialog}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.deleteIconWrap}>
          <Trash2 size={28} />
        </div>
        <h3 className={styles.deleteTitle}>Delete Product</h3>
        <p className={styles.deleteText}>
          Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
        </p>
        <div className={styles.deleteActions}>
          <motion.button
            className={styles.cancelBtn}
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Cancel
          </motion.button>
          <motion.button
            className={styles.deleteBtn}
            onClick={() => onConfirm(product._id)}
            disabled={deleting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Error State ──────────────────────────────────────────────
const ErrorState = ({ message, onRetry }) => (
  <motion.div
    className={styles.errorState}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <AlertCircle size={48} />
    <h3>Failed to load products</h3>
    <p>{message || "Something went wrong. Please try again."}</p>
    <motion.button
      className={styles.retryBtn}
      onClick={onRetry}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <RefreshCw size={16} />
      Try Again
    </motion.button>
  </motion.div>
);

// ─── ProductsPage (Main) ─────────────────────────────────────
const ProductsPage = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Drawer / Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // ─── Fetch Products ─────────────────────────────────────────
  const fetchProducts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await axios.get(PRODUCTS_ENDPOINTS.ALL);
      const data = Array.isArray(res.data) ? res.data : res.data.products || res.data.data || [];
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ─── Add / Edit Product ────────────────────────────────────
  const handleSubmitProduct = async (formData, isEdit) => {
    try {
      setSubmitting(true);
      if (isEdit && editProduct) {
        await axios.put(PRODUCTS_ENDPOINTS.UPDATE(editProduct._id), formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(PRODUCTS_ENDPOINTS.ADD, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setShowAddModal(false);
      setEditProduct(null);
      await fetchProducts();
    } catch (err) {
      console.error("Product submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete Product ────────────────────────────────────────
  const handleDeleteProduct = async (id) => {
    try {
      setDeleting(true);
      await axios.delete(PRODUCTS_ENDPOINTS.DELETE(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteProduct(null);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  // ─── Categories list ───────────────────────────────────────
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [products]);

  // ─── Filtered & Sorted ─────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q),
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (stockFilter !== "all") {
      result = result.filter((p) => {
        const s = p.stock ?? 0;
        if (stockFilter === "in") return s > 0;
        if (stockFilter === "low") return s > 0 && s <= 10;
        if (stockFilter === "out") return s <= 0;
        return true;
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "stock-high":
          return (b.stock || 0) - (a.stock || 0);
        case "stock-low":
          return (a.stock || 0) - (b.stock || 0);
        case "alpha":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return result;
  }, [products, search, categoryFilter, stockFilter, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setStockFilter("all");
    setSortBy("newest");
  };

  return (
    <div className={styles.productsPage}>
      <ProductsHeader
        onRefresh={() => fetchProducts(true)}
        refreshing={refreshing}
        onAddProduct={() => setShowAddModal(true)}
      />

      <ProductKPICards products={products} />

      <ProductsFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={resetFilters}
        resultCount={filteredProducts.length}
        categories={categories}
      />

      {error ? (
        <ErrorState message={error} onRetry={fetchProducts} />
      ) : (
        <ProductsGrid
          products={filteredProducts}
          onViewDetails={(product) => setSelectedProduct(product)}
          onEdit={(product) => setEditProduct(product)}
          onDelete={(product) => setDeleteProduct(product)}
          loading={loading}
        />
      )}

      {/* Details Drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDrawer
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editProduct) && (
          <ProductModal
            product={editProduct}
            onClose={() => { setShowAddModal(false); setEditProduct(null); }}
            onSubmit={handleSubmitProduct}
            submitting={submitting}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteProduct && (
          <DeleteProductDialog
            product={deleteProduct}
            onClose={() => setDeleteProduct(null)}
            onConfirm={handleDeleteProduct}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
