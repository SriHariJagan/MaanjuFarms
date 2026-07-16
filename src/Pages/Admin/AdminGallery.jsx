import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Plus, Trash2, Image as ImageIcon, AlertCircle, RefreshCw
} from "lucide-react";
import { useAuth } from "../../Store/useContext";
import { GALLERY_API, IMAGE_BASE } from "../../urls";
import AdminModal from "../../Components/Admin/AdminModal";
import { MultiImageUploader } from "../../Components/Admin/ImageUploader";
import ConfirmDialog from "../../Components/Admin/ConfirmDialog";
import "./AdminGallery.css";

const AdminGallery = () => {
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(GALLERY_API);
      const d = res.data;
      setImages(d?.images || d?.data || (Array.isArray(d) ? d : []));
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to load gallery");
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const resolveUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${IMAGE_BASE}${url.replace(/^\//, "")}`;
  };

  const handleAddImages = async (files) => {
    setUploading(true);
    const newImages = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await axios.post(GALLERY_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        const item = res.data.image || res.data;
        newImages.push(item);
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    if (newImages.length > 0) {
      setImages((prev) => [...newImages, ...prev]);
      toast.success(`${newImages.length} image(s) uploaded`);
    }
    setUploading(false);
  };

  const confirmDelete = (item) => setDeleteTarget(item);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const id = deleteTarget._id;
    try {
      await axios.delete(`${GALLERY_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast.success("Image deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete image");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-gallery">
        <div className="admin-gallery-header">
          <h2>Gallery</h2>
        </div>
        <div className="admin-gallery-grid">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="admin-skeleton admin-skeleton--gallery" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-gallery">
        <div className="admin-error-state">
          <AlertCircle size={48} />
          <h3>Failed to load gallery</h3>
          <p>{error}</p>
          <button className="admin-btn admin-btn--primary" onClick={fetchImages}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-gallery">
      <div className="admin-gallery-header">
        <div>
          <h2>Gallery</h2>
          <p className="admin-gallery-subtitle">{images.length} image(s) uploaded</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Images
        </button>
      </div>

      {images.length === 0 ? (
        <div className="admin-empty-state">
          <ImageIcon size={48} />
          <h3>No images yet</h3>
          <p>Upload your first image to populate the gallery</p>
          <button className="admin-btn admin-btn--primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Add Images
          </button>
        </div>
      ) : (
        <div className="admin-gallery-grid">
          {images.map((item) => (
            <div key={item._id} className="admin-gallery-item">
              <img
                src={resolveUrl(item.image || item.imageUrl)}
                alt={item.title || ""}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.classList.add("admin-gallery-item--broken");
                }}
              />
              <div className="admin-gallery-overlay">
                {item.title && <span className="admin-gallery-title">{item.title}</span>}
                <button
                  className="admin-gallery-delete"
                  onClick={() => confirmDelete(item)}
                  title="Delete image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Images"
        size="md"
      >
        <div className="admin-gallery-upload">
          <MultiImageUploader
            images={[]}
            onUploadComplete={(url) => {
              // refresh list when uploads complete
            }}
            onRemove={() => {}}
            endpoint={GALLERY_API}
            token={token}
          />
          <div className="admin-gallery-upload-hint">
            Drop images here or click to browse. Multiple images supported.
          </div>
          <div className="admin-form-actions" style={{ marginTop: 20 }}>
            <button
              className="admin-btn admin-btn--ghost"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="admin-btn admin-btn--primary"
              onClick={() => {
                fetchImages();
                setModalOpen(false);
              }}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Done"}
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default AdminGallery;
