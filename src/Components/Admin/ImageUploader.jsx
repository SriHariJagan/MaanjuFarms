import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import axios from "axios";
import { IMAGE_BASE } from "../../urls";
import "./ImageUploader.css";

const ImageUploader = ({
  currentImage,
  onUploadComplete,
  onRemove,
  endpoint,
  token,
}) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, WebP, AVIF, GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setProgress(pct);
        },
      });
      const imageUrl = res.data.image || res.data.url || res.data.filePath || "";
      setPreview(imageUrl.startsWith("http") ? imageUrl : `${IMAGE_BASE}${imageUrl}`);
      onUploadComplete(imageUrl);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Upload failed");
      if (localUrl) URL.revokeObjectURL(localUrl);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [endpoint, token, onUploadComplete]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    if (preview && !preview.startsWith("http")) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
    if (onRemove) onRemove();
  };

  const resolvedPreview = preview && !preview.startsWith("blob:")
    ? preview
    : preview;

  return (
    <div className="iu-wrapper">
      {resolvedPreview ? (
        <div className="iu-preview">
          <img
            src={resolvedPreview}
            alt="Preview"
            className="iu-preview-img"
            onError={() => setError("Failed to load preview")}
          />
          {uploading && (
            <div className="iu-progress-overlay">
              <div className="iu-progress-ring">
                <svg viewBox="0 0 36 36" className="iu-progress-svg">
                  <path
                    className="iu-progress-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="iu-progress-fill"
                    strokeDasharray={`${progress}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="iu-progress-text">{progress}%</span>
              </div>
            </div>
          )}
          <button className="iu-remove-btn" onClick={handleRemove} disabled={uploading}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          className={`iu-dropzone ${dragOver ? "iu-dropzone--active" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={24} />
          <span className="iu-dropzone-text">Drop an image here or click to browse</span>
          <span className="iu-dropzone-hint">JPEG, PNG, WebP, AVIF, GIF — max 5MB</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={handleChange}
        className="iu-hidden-input"
      />

      {error && (
        <div className="iu-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

const MultiImageUploader = ({
  images,
  onUploadComplete,
  onRemove,
  endpoint,
  token,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadingIds, setUploadingIds] = useState(new Set());
  const inputRef = useRef(null);

  const uploadFile = async (file) => {
    const id = Math.random().toString(36).slice(2);
    setUploadingIds((prev) => new Set(prev).add(id));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const imageUrl = res.data.image || res.data.url || res.data.filePath || "";
      onUploadComplete(imageUrl.startsWith("http") ? imageUrl : `${IMAGE_BASE}${imageUrl}`);
    } catch {
      // silent per-image failure handled by caller
    } finally {
      setUploadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      ["image/jpeg","image/png","image/webp","image/avif","image/gif"].includes(f.type)
    );
    files.forEach(uploadFile);
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(uploadFile);
    e.target.value = "";
  };

  return (
    <div className="miu-wrapper">
      <div className="miu-grid">
        {images.map((img, i) => (
          <div className="miu-item" key={i}>
            <img src={img} alt="" className="miu-item-img" />
            <button
              className="miu-item-remove"
              onClick={() => onRemove(i)}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <div
          className={`miu-add ${dragOver ? "miu-add--active" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {uploadingIds.size > 0 ? (
            <span className="miu-uploading">{uploadingIds.size} uploading...</span>
          ) : (
            <>
              <ImageIcon size={20} />
              <span>Add Images</span>
            </>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={handleChange}
        className="iu-hidden-input"
      />
    </div>
  );
};

export { ImageUploader, MultiImageUploader };
export default ImageUploader;
