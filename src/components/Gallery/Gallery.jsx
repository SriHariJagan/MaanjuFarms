import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import styles from "./Gallery.module.css";
import axios from "axios";
import { GALLERY_API } from "../../urls";
import { useAuth } from "../../Store/useContext";
import { getImageUrl } from "../../utils/getImageUrl ";

const Gallery = () => {
  const { isAdmin, token } = useAuth();
  const [galleryItems, setGalleryItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    imageUrl: "",
    id: null,
    preview: null,
  });

  // Fetch gallery items
  const fetchGallery = async () => {
    try {
      const { data } = await axios.get(GALLERY_API);
      setGalleryItems(data);
    } catch (err) {
      console.error("Error fetching gallery", err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openLightbox = (index) => setCurrentIndex(index);
  const closeLightbox = () => setCurrentIndex(null);

  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  };

  // Open modal for add
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ title: "", image: null, imageUrl: "", id: null, preview: null });
    setShowModal(true);
  };

  // Open modal for edit
  const openEditModal = (item) => {
    setIsEditing(true);
    setFormData({
      title: item.title,
      image: null,
      imageUrl: item.imageUrl || "",
      id: item._id,
      preview: getImageUrl(item.imageUrl),
    });
    setShowModal(true);
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
        imageUrl: "",
        preview: files[0], // store File object
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        preview: value ? value : prev.preview,
      }));
    }
  };

  // Save (add or update)
  const handleSave = async () => {
    if (!formData.title || (!formData.image && !formData.imageUrl)) {
      alert("Please provide title and image or URL");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);

    if (formData.image) form.append("image", formData.image);
    else if (formData.imageUrl) form.append("imageUrl", formData.imageUrl);

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
      await fetchGallery();
      setShowModal(false);
    } catch (err) {
      console.error("Error saving gallery item", err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await axios.delete(`${GALLERY_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchGallery();
    } catch (err) {
      console.error("Error deleting gallery item", err);
    }
  };

  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.title}>Our Gallery</h2>
      <p className={styles.subtitle}>
        Discover the beauty of Maanjoo Farming – from nature and animals to cultural experiences and peaceful stays.
      </p>

      {isAdmin && (
        <button className={styles.addImageBtn} onClick={openAddModal}>
          <Plus size={22} />
        </button>
      )}

      <div className={styles.grid}>
        {galleryItems.map((item, index) => (
          <div className={styles.card} key={item._id}>
            <img
              src={getImageUrl(item.imageUrl)}
              alt={item.title}
              className={styles.image}
              onClick={() => openLightbox(index)}
            />
            <div className={styles.overlay}>
              <span>{item.title}</span>
            </div>

            {isAdmin && (
              <div className={styles.cardActions}>
                <button onClick={() => openEditModal(item)}>
                  <Edit size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(item._id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {currentIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.closeBtn} onClick={closeLightbox}>
            <X size={28} />
          </button>
          <button className={styles.prevBtn} onClick={showPrev}>
            <ChevronLeft size={40} />
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={getImageUrl(galleryItems[currentIndex].imageUrl)}
              alt={galleryItems[currentIndex].title}
              className={styles.lightboxImage}
            />
            <p className={styles.lightboxTitle}>{galleryItems[currentIndex].title}</p>
          </div>
          <button className={styles.nextBtn} onClick={showNext}>
            <ChevronRight size={40} />
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>{isEditing ? "Update Image" : "Add New Image"}</h3>

            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter image title"
            />

            <label>Upload Image</label>
            <input type="file" name="image" onChange={handleChange} />

            <label>Or Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Paste image URL"
            />

            {formData.preview && (
              <img
                src={getImageUrl(formData.preview)}
                alt="Preview"
                className={styles.previewImage}
              />
            )}

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
