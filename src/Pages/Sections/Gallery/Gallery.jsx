import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import styles from "./Gallery.module.css";
import axios from "axios";
import { GALLERY_API } from "../../../urls";
import { useAuth } from "../../../Store/useContext";
import { getImageUrl } from "../../../utils/getImageUrl ";
import { useSwipeable } from "react-swipeable";

/* ================= CARD ================= */
const GalleryCard = ({ item, index, isAdmin, onEdit, onDelete, onOpen }) => {
  return (
    <div className={styles.card}>
      <img
        src={getImageUrl(item.imageUrl)}
        alt={item.title}
        className={styles.image}
        onClick={() => onOpen(index)}
      />

      <div className={styles.overlay}>
        <span>{item.title}</span>
      </div>

      {isAdmin && (
        <div className={styles.cardActions}>
          <button onClick={() => onEdit(item)}>
            <Edit size={16} /> Edit
          </button>
          <button onClick={() => onDelete(item._id)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

/* ================= LIGHTBOX ================= */

const Lightbox = ({ items, index, onClose, onPrev, onNext }) => {
  if (index === null) return null;

  const handlers = useSwipeable({
    onSwipedLeft: () => onNext({ stopPropagation: () => {} }),
    onSwipedRight: () => onPrev({ stopPropagation: () => {} }),
    trackTouch: true,
    trackMouse: false, // optional (disable mouse drag)
  });

  return (
    <div className={styles.lightbox} onClick={onClose}>
      <button className={styles.closeBtn} onClick={onClose}>
        <X size={28} />
      </button>

      {/* Prev Button (hidden on mobile via CSS) */}
      <button className={styles.prevBtn} onClick={onPrev}>
        <ChevronLeft className={styles.icon} />
      </button>

      {/* 👇 SWIPE AREA */}
      <div
        {...handlers}
        className={styles.lightboxContent}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={getImageUrl(items[index].imageUrl)}
          alt={items[index].title}
          className={styles.lightboxImage}
        />
        <p className={styles.lightboxTitle}>{items[index].title}</p>
      </div>

      {/* Next Button */}
      <button className={styles.nextBtn} onClick={onNext}>
        <ChevronRight className={styles.icon} />
      </button>
    </div>
  );
};

/* ================= MODAL ================= */
const GalleryModal = ({
  show,
  isEditing,
  formData,
  onChange,
  onClose,
  onSave,
}) => {
  if (!show) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>{isEditing ? "Update Image" : "Add New Image"}</h3>

        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
        />

        <label>Upload Image</label>
        <input type="file" name="image" onChange={onChange} />

        <label>Or Image URL</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={onChange}
        />

        {formData.preview && (
          <img
            src={getImageUrl(formData.preview)}
            alt="Preview"
            className={styles.previewImage}
          />
        )}

        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.btnCancel}>
            Cancel
          </button>

          <button onClick={onSave} className={styles.btnPrimary}>
            {isEditing ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN ================= */
const Gallery = () => {
  const { isAdmin, token } = useAuth();

  const [galleryItems, setGalleryItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image: null,
    imageUrl: "",
    id: null,
    preview: null,
  });

  /* API */
  const fetchGallery = async () => {
    try {
      const { data } = await axios.get(GALLERY_API);
      setGalleryItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  /* LIGHTBOX */
  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i === 0 ? galleryItems.length - 1 : i - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i === galleryItems.length - 1 ? 0 : i + 1));
  };

  /* MODAL */
  const openAdd = () => {
    setIsEditing(false);
    setFormData({
      title: "",
      image: null,
      imageUrl: "",
      id: null,
      preview: null,
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setIsEditing(true);
    setFormData({
      title: item.title,
      image: null,
      imageUrl: item.imageUrl,
      id: item._id,
      preview: item.imageUrl,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
        imageUrl: "",
        preview: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!formData.title || (!formData.image && !formData.imageUrl)) {
      return alert("Title & Image required");
    }

    const form = new FormData();
    form.append("title", formData.title);

    if (formData.image) form.append("image", formData.image);
    else form.append("imageUrl", formData.imageUrl);

    try {
      if (isEditing) {
        await axios.put(`${GALLERY_API}/${formData.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(GALLERY_API, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchGallery();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    await axios.delete(`${GALLERY_API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchGallery();
  };

  /* UI */
  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.title}>Gallery</h2>

      {isAdmin && (
        <button className={styles.addImageBtn} onClick={openAdd}>
          <Plus size={22} />
        </button>
      )}

      <div className={styles.grid}>
        {galleryItems.map((item, index) => (
          <GalleryCard
            key={item._id}
            item={item}
            index={index}
            isAdmin={isAdmin}
            onEdit={openEdit}
            onDelete={handleDelete}
            onOpen={setCurrentIndex}
          />
        ))}
      </div>

      <Lightbox
        items={galleryItems}
        index={currentIndex}
        onClose={() => setCurrentIndex(null)}
        onPrev={showPrev}
        onNext={showNext}
      />

      <GalleryModal
        show={showModal}
        isEditing={isEditing}
        formData={formData}
        onChange={handleChange}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </section>
  );
};

export default Gallery;
