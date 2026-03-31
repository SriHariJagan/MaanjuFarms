import React, { useState, useEffect } from "react";
import styles from "./VillasStays.module.css";
import { toast } from "react-toastify";

const VillaFormModal = ({ villa, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    type: "villa",
    price: "",
    status: "available",
  });

  useEffect(() => {
    if (villa) setForm(villa);
  }, [villa]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.image || !form.price)
      return toast.error("All fields required");

    onSubmit({ ...form, category: "villa" });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>

        <h3>{villa ? "Edit Villa" : "Add Villa"}</h3>

        <form className={styles.modalContent} onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="villa">Villa</option>
            <option value="suite">Suite</option>
          </select>

          <input name="price" type="number" value={form.price} onChange={handleChange} />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <button className={styles.bookBtn}>
            {villa ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VillaFormModal;