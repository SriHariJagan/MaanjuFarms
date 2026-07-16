import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Upload,
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Clock,
  CalendarDays,
  ArrowLeft,
  AlertCircle,
  HardDrive,
  ZoomIn,
} from "lucide-react";
import { useAuth } from "../../../Store/useContext";
import { GALLERY_API, IMAGE_BASE } from "../../../urls";
import { getImageUrl } from "../../../utils/getImageUrl ";
import styles from "./GalleryPage.module.css";

// ─── Image Preview Component ────────────────────────────────
const GalleryImage = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  const url = getImageUrl(src);
  if (!url || error) {
    return (
      <div className={`${styles.imgPlaceholder} ${className || ""}`}>
        <ImageIcon size={24} />
      </div>
    );
  }
  return <img src={url} alt={alt || "Gallery image"} className={className || ""} onError={() => setError(true)} loading="lazy" />;
};

// ─── GalleryHeader ──────────────────────────────────────────
const GalleryHeader = ({ onRefresh, refreshing, onUpload }) => (
  <motion.div
    className={styles.pageHeader}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <div>
      <h1 className={styles.pageTitle}>Gallery</h1>
      <p className={styles.pageSubtitle}>Manage all gallery images displayed on the website.</p>
    </div>
    <div className={styles.headerActions}>
      <motion.button
        className={`${styles.headerBtn} ${styles.uploadBtn}`}
        onClick={onUpload}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <Upload size={16} />
        <span>Upload Image</span>
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

// ─── GalleryKPICards ────────────────────────────────────────
const KPI_CARDS = [
  { key: "total", label: "Total Images", icon: ImageIcon, color: "#609966" },
  { key: "thisMonth", label: "Added This Month", icon: Clock, color: "#2563eb" },
  { key: "latest", label: "Latest Upload", icon: CalendarDays, color: "#d97706" },
  { key: "storage", label: "Storage Used", icon: HardDrive, color: "#40513B" },
];

const GalleryKPICards = ({ images }) => {
  const counts = useMemo(() => {
    const raw = images || [];
    const now = new Date();
    const thisMonth = raw.filter((img) => {
      if (!img.createdAt) return false;
      const d = new Date(img.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const sorted = [...raw].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return {
      total: raw.length,
      thisMonth: thisMonth.length,
      latest: sorted[0]?.title || "—",
      storage: "—",
    };
  }, [images]);

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
          {card.key === "latest" && counts.latest !== "—" && (
            <div className={styles.kpiExtra} title={counts.latest}>{counts.latest}</div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ─── GalleryFilters ─────────────────────────────────────────
const GalleryFilters = ({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  onReset,
  resultCount,
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
            placeholder="Search by title..."
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
          <span>Sort</span>
          <ChevronDown size={14} className={showFilters ? styles.chevronUp : ""} />
        </motion.button>

        <div className={styles.resultCount}>{resultCount} images</div>
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
                <label>Sort By</label>
                <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
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
                Reset
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── GalleryGrid ────────────────────────────────────────────
const GalleryGrid = ({ images, onView, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className={styles.gridWrapper}>
        <div className={styles.galleryGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skelCard}>
              <div className={styles.skelCardImage} />
              <div className={styles.skelCardBody}>
                <div className={styles.skelBox} style={{ width: "70%", height: 14 }} />
                <div className={styles.skelBox} style={{ width: "40%", height: 11 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <motion.div
        className={styles.emptyState}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.emptyIcon}>
          <ImageIcon size={48} />
        </div>
        <h3 className={styles.emptyTitle}>No Images Available</h3>
        <p className={styles.emptyText}>Upload your first image to get started. Click "Upload Image" above.</p>
      </motion.div>
    );
  }

  return (
    <div className={styles.gridWrapper}>
      <motion.div className={styles.galleryGrid} layout>
        <AnimatePresence mode="popLayout">
          {images.map((item) => (
            <motion.div
              key={item._id}
              className={styles.galleryCard}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.cardImageWrap} onClick={() => onView(item)}>
                <GalleryImage src={item.imageUrl} alt={item.title} className={styles.cardImage} />
                <div className={styles.cardOverlay}>
                  <ZoomIn size={20} />
                </div>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.title || "Untitled"}</h3>
                {item.createdAt && (
                  <span className={styles.cardDate}>
                    <CalendarDays size={11} />
                    {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
              </div>

              <div className={styles.cardActions}>
                <motion.button
                  className={styles.cardActionBtn}
                  onClick={() => onView(item)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  title="View"
                >
                  <Eye size={13} />
                  <span>View</span>
                </motion.button>
                <motion.button
                  className={styles.cardActionBtn}
                  onClick={() => onEdit(item)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  title="Edit"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </motion.button>
                <motion.button
                  className={`${styles.cardActionBtn} ${styles.cardActionDanger}`}
                  onClick={() => onDelete(item)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  title="Delete"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// ─── Image Viewer (Fullscreen Lightbox) ─────────────────────
const ImageViewer = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <motion.div
      className={styles.viewerOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.viewerContent}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.viewerClose} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.viewerImageWrap}>
          <GalleryImage src={item.imageUrl} alt={item.title} className={styles.viewerImage} />
        </div>

        <div className={styles.viewerMeta}>
          <h2 className={styles.viewerTitle}>{item.title || "Untitled"}</h2>
          {item.createdAt && (
            <span className={styles.viewerDate}>
              <CalendarDays size={14} />
              {new Date(item.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Image Modal (Upload / Edit) ────────────────────────────
const INITIAL_FORM = { title: "" };

const ImageModal = ({ item, onClose, onSubmit, submitting }) => {
  const isEdit = !!item;
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (item) {
      setForm({ title: item.title || "" });
      setImagePreview(getImageUrl(item.imageUrl));
    } else {
      setForm(INITIAL_FORM);
      setImageFile(null);
      setImagePreview(null);
    }
  }, [item]);

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
    formData.append("title", form.title);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    onSubmit(formData, isEdit);
  };

  const dirty = form.title !== (item?.title || "") || !!imageFile;

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
            <h2 className={styles.modalTitle}>{isEdit ? "Edit Image" : "Upload Image"}</h2>
            <p className={styles.modalSub}>{isEdit ? "Update image title or replace the image file." : "Add a new image to the gallery."}</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label>Image Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Organic Farm Morning"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>{isEdit ? "Replace Image (optional)" : "Image *"}</label>
              <div className={styles.imageUploadArea}>
                {imagePreview ? (
                  <div className={styles.imagePreviewWrap}>
                    <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                    <button
                      type="button"
                      className={styles.imageRemove}
                      onClick={() => { setImageFile(null); setImagePreview(isEdit ? getImageUrl(item?.imageUrl) : null); }}
                    >
                      <X size={14} />
                    </button>
                    <span className={styles.imagePreviewLabel}>
                      {isEdit ? "Image will be replaced" : "Image selected"}
                    </span>
                  </div>
                ) : (
                  <label className={styles.imageUploadLabel}>
                    <Upload size={24} />
                    <span>Click to upload or drag & drop</span>
                    <span className={styles.imageUploadHint}>JPG, PNG or WebP</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
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
              disabled={submitting || !form.title || (!isEdit && !imageFile) || !dirty}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {submitting ? (isEdit ? "Updating..." : "Uploading...") : (isEdit ? "Save Changes" : "Upload Image")}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Delete Confirmation Dialog ─────────────────────────────
const DeleteDialog = ({ item, onClose, onConfirm, deleting }) => {
  if (!item) return null;

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

        <div className={styles.deletePreview}>
          <GalleryImage src={item.imageUrl} alt={item.title} className={styles.deleteThumb} />
        </div>

        <h3 className={styles.deleteTitle}>Delete Image</h3>
        <p className={styles.deleteText}>
          Are you sure you want to delete <strong>{item.title || "this image"}</strong>? This action cannot be undone.
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
            onClick={() => onConfirm(item._id)}
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
    <h3>Failed to load gallery</h3>
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

// ─── GalleryPage (Main) ─────────────────────────────────────
const GalleryPage = () => {
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Viewer / Modals
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  // ─── Fetch Gallery ────────────────────────────────────────
  const fetchGallery = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await axios.get(GALLERY_API);
      const data = Array.isArray(res.data) ? res.data : res.data.images || res.data.data || [];
      setImages(data);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to fetch gallery");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // ─── Submit (Upload / Edit) ───────────────────────────────
  const handleSubmit = async (formData, isEdit) => {
    try {
      setSubmitting(true);
      if (isEdit && editItem) {
        await axios.put(`${GALLERY_API}/${editItem._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(GALLERY_API, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setShowUpload(false);
      setEditItem(null);
      await fetchGallery();
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await axios.delete(`${GALLERY_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteItem(null);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  // ─── Filtered & Sorted ────────────────────────────────────
  const filteredImages = useMemo(() => {
    let result = [...images];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((img) => img.title?.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "alpha":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return result;
  }, [images, search, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setSortBy("newest");
  };

  return (
    <div className={styles.galleryPage}>
      <GalleryHeader onRefresh={() => fetchGallery(true)} refreshing={refreshing} onUpload={() => setShowUpload(true)} />

      <GalleryKPICards images={images} />

      <GalleryFilters
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={resetFilters}
        resultCount={filteredImages.length}
      />

      {error ? (
        <ErrorState message={error} onRetry={fetchGallery} />
      ) : (
        <GalleryGrid
          images={filteredImages}
          onView={(item) => setViewItem(item)}
          onEdit={(item) => setEditItem(item)}
          onDelete={(item) => setDeleteItem(item)}
          loading={loading}
        />
      )}

      {/* Fullscreen Viewer */}
      <AnimatePresence>
        {viewItem && (
          <ImageViewer item={viewItem} onClose={() => setViewItem(null)} />
        )}
      </AnimatePresence>

      {/* Upload / Edit Modal */}
      <AnimatePresence>
        {(showUpload || editItem) && (
          <ImageModal
            item={editItem}
            onClose={() => { setShowUpload(false); setEditItem(null); }}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteItem && (
          <DeleteDialog
            item={deleteItem}
            onClose={() => setDeleteItem(null)}
            onConfirm={handleDelete}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
