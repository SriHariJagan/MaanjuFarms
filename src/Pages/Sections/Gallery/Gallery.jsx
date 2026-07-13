import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";
import styles from "./Gallery.module.css";
import axios from "axios";
import { GALLERY_API } from "../../../urls";
import { useAuth } from "../../../Store/useContext";
import { getImageUrl } from "../../../utils/getImageUrl ";
import { useSwipeable } from "react-swipeable";

const containerVariants = {
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
      whileHover={{ y: -4 }}
    >
      <img
        src={getImageUrl(item.imageUrl)}
        alt={item.title}
        className={styles.image}
        onClick={() => onOpen(index)}
        loading="lazy"
      />
      <div className={styles.overlay}>
        <span>{item.title}</span>
      </div>
      {isAdmin && (
        <div className={styles.cardActions}>
          <button onClick={() => onEdit(item)}>
            <Edit size={14} />
          </button>
          <button onClick={() => onDelete(item._id)}>
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
      <button className={styles.closeBtn} onClick={onClose}>
        <X size={24} />
      </button>
      <button className={styles.navBtn} onClick={onPrev}>
        <ChevronLeft size={28} />
      </button>
      <div {...handlers} className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
        <motion.img
          key={index}
          src={getImageUrl(items[index].imageUrl)}
          alt={items[index].title}
          className={styles.lightboxImage}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        <p className={styles.lightboxTitle}>{items[index].title}</p>
      </div>
      <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={onNext}>
        <ChevronRight size={28} />
      </button>
    </motion.div>
  );
};

const GalleryModal = ({ show, isEditing, formData, onChange, onClose, onSave }) => {
  if (!show) return null;

  return (
    <motion.div
      className={styles.modal}
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
        <h3>{isEditing ? "Update Image" : "Add New Image"}</h3>

        <label>Title</label>
        <input type="text" name="title" value={formData.title} onChange={onChange} />

        <label>Upload Image</label>
        <input type="file" name="image" onChange={onChange} />

        <label>Or Image URL</label>
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={onChange} />

        {formData.preview && (
          <img src={getImageUrl(formData.preview)} alt="Preview" className={styles.previewImage} />
        )}

        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.btnCancel}>Cancel</button>
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
    title: "", image: null, imageUrl: "", id: null, preview: null,
  });

  const fetchGallery = async () => {
    try {
      const { data } = await axios.get(GALLERY_API);
      setGalleryItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

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
    setFormData({ title: "", image: null, imageUrl: "", id: null, preview: null });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setIsEditing(true);
    setFormData({ title: item.title, image: null, imageUrl: item.imageUrl, id: item._id, preview: item.imageUrl });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file, imageUrl: "", preview: URL.createObjectURL(file) }));
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
      <div className={styles.galleryHeader}>
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

      {isAdmin && (
        <button className={styles.addBtn} onClick={openAdd}>
          <Plus size={18} />
          Add Image
        </button>
      )}

      {galleryItems.length === 0 ? (
        <div className={styles.empty}>
          <ImageIcon size={48} className={styles.emptyIcon} />
          <p>No images yet</p>
        </div>
      ) : (
        <motion.div
          className={styles.grid}
          variants={containerVariants}
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
