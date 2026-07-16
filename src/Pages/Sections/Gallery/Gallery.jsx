import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  Leaf,
} from "lucide-react";
import styles from "./Gallery.module.css";
import axios from "axios";
import { GALLERY_API } from "../../../urls";
import { useAuth } from "../../../Store/useContext";
import { getImageUrl } from "../../../utils/getImageUrl ";
import { useSwipeable } from "react-swipeable";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const GalleryCard = ({ item, index, isAdmin, onEdit, onDelete, onOpen }) => {
  return (
    <motion.div
      className={styles.card}
      layout
      variants={cardVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.imageWrapper}>
        <img
          src={getImageUrl(item.imageUrl)}
          alt={item.title}
          className={styles.image}
          onClick={() => onOpen(index)}
          loading="lazy"
        />
        <div className={styles.imageOverlay}>
          <span className={styles.imageTitle}>{item.title}</span>
        </div>
      </div>
      {isAdmin && (
        <div className={styles.cardActions}>
          <button onClick={() => onEdit(item)} aria-label="Edit">
            <Edit size={14} />
          </button>
          <button onClick={() => onDelete(item._id)} aria-label="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

const Lightbox = ({ items, index, onClose, onPrev, onNext }) => {
  if (index === null) return null;

  const handlers = useSwipeable({
    onSwipedLeft: () => onNext({ stopPropagation: () => {} }),
    onSwipedRight: () => onPrev({ stopPropagation: () => {} }),
    trackTouch: true,
  });

  return (
    <motion.div
      className={styles.lightbox}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button className={styles.lightboxClose} onClick={onClose} aria-label="Close">
        <X size={24} />
      </button>

      <button className={styles.lightboxNav} onClick={onPrev} aria-label="Previous">
        <ChevronLeft size={28} />
      </button>

      <div
        {...handlers}
        className={styles.lightboxContent}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          key={index}
          src={getImageUrl(items[index].imageUrl)}
          alt={items[index].title}
          className={styles.lightboxImage}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.p
          className={styles.lightboxCaption}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {items[index].title}
        </motion.p>
      </div>

      <button
        className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
        onClick={onNext}
        aria-label="Next"
      >
        <ChevronRight size={28} />
      </button>

      <div className={styles.lightboxCounter}>
        {index + 1} / {items.length}
      </div>
    </motion.div>
  );
};

const GalleryModal = ({ show, isEditing, formData, onChange, onClose, onSave }) => {
  if (!show) return null;

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modalContent}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>{isEditing ? "Update Image" : "Add New Image"}</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <label className={styles.modalLabel}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            className={styles.modalInput}
            placeholder="Image title"
          />

          <label className={styles.modalLabel}>Upload Image</label>
          <div className={styles.modalUpload}>
            <input type="file" name="image" onChange={onChange} />
          </div>

          <label className={styles.modalLabel}>Or Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={onChange}
            className={styles.modalInput}
            placeholder="https://..."
          />

          {formData.preview && (
            <div className={styles.modalPreview}>
              <img
                src={getImageUrl(formData.preview)}
                alt="Preview"
              />
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.btnCancel}>
            Cancel
          </button>
          <button onClick={onSave} className={styles.btnPrimary}>
            {isEditing ? "Update" : "Save"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

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

  const fetchGallery = async () => {
    try {
      const { data } = await axios.get(GALLERY_API);
      setGalleryItems(Array.isArray(data) ? data : (data?.images || data?.data || []));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i === 0 ? galleryItems.length - 1 : i - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i === galleryItems.length - 1 ? 0 : i + 1));
  };

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

  return (
    <section className={styles.gallerySection}>
      {/* Header */}
      <div className={styles.galleryHeader}>
        <motion.div
          className={styles.galleryDecorator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Leaf size={16} />
        </motion.div>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Gallery
        </motion.h2>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Capturing the essence of farm life
        </motion.p>
      </div>

      {/* Admin Add Button */}
      {isAdmin && (
        <motion.button
          className={styles.addBtn}
          onClick={openAdd}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          Add Image
        </motion.button>
      )}

      {/* Gallery Grid */}
      {galleryItems.length === 0 ? (
        <motion.div
          className={styles.empty}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <ImageIcon size={48} className={styles.emptyIcon} />
          <p>No images yet</p>
        </motion.div>
      ) : (
        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
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
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {currentIndex !== null && (
          <Lightbox
            items={galleryItems}
            index={currentIndex}
            onClose={() => setCurrentIndex(null)}
            onPrev={showPrev}
            onNext={showNext}
          />
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <GalleryModal
            show={showModal}
            isEditing={isEditing}
            formData={formData}
            onChange={handleChange}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
