import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./PincodeManagement.module.css";
import axios from "axios";
import { PINCODE_ENDPOINTS } from "../../urls";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

const PincodeManagement = () => {
  const [formData, setFormData] = useState({ pincode: "", district: "", state: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [pincodes, setPincodes] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchBlockedPincodes = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(PINCODE_ENDPOINTS.BLOCKED, { headers: { Authorization: `Bearer ${token}` } });
      setPincodes(res.data.data || []);
    } catch (err) { console.log(err); }
    finally { setFetching(false); }
  };

  useEffect(() => { fetchBlockedPincodes(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pincode") { if (!/^\d*$/.test(value)) return; if (value.length > 6) return; }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
    if (!/^\d{6}$/.test(formData.pincode)) { setError("Please enter valid 6 digit pincode"); return; }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(PINCODE_ENDPOINTS.BLOCKED, formData, { headers: { Authorization: `Bearer ${token}` } });
      setMessage(res.data.message);
      setFormData({ pincode: "", district: "", state: "", reason: "" });
      fetchBlockedPincodes();
    } catch (err) { setError(err?.response?.data?.message || "Unable to add pincode"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this blocked pincode?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(PINCODE_ENDPOINTS.DELETE(id), { headers: { Authorization: `Bearer ${token}` } });
      fetchBlockedPincodes();
    } catch (err) { console.log(err); }
  };

  return (
    <motion.section className={styles.wrapper} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <motion.div className={styles.headerSection} variants={fadeUp} initial="initial" animate="animate">
        <div>
          <span className={styles.badge}>Delivery Management</span>
          <h1>Restricted Delivery Pincodes</h1>
          <p>Manage locations where delivery service is unavailable.</p>
        </div>
      </motion.div>

      <motion.div className={styles.grid} variants={stagger} initial="initial" animate="animate">
        <motion.div className={styles.formCard} variants={fadeUp}>
          <div className={styles.cardTop}>
            <h2>Add Restricted Pincode</h2>
            <p>Block delivery access for selected regions.</p>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Enter Pincode" />
            </div>
            <div className={styles.inputGroup}>
              <label>District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="Enter District" />
            </div>
            <div className={styles.inputGroup}>
              <label>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Enter State" />
            </div>
            <div className={styles.inputGroup}>
              <label>Reason</label>
              <textarea rows="4" name="reason" value={formData.reason} onChange={handleChange} placeholder="Delivery restriction reason" />
            </div>
            {message && <div className={styles.successBox}>{message}</div>}
            {error && <div className={styles.errorBox}>{error}</div>}
            <motion.button type="submit" disabled={loading} className={styles.submitBtn} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {loading ? "Adding..." : "Add Restricted Pincode"}
            </motion.button>
          </form>
        </motion.div>

        <motion.div className={styles.listCard} variants={fadeUp}>
          <div className={styles.cardTop}>
            <h2>Blocked Locations</h2>
            <span className={styles.countBadge}>{pincodes.length} Locations</span>
          </div>
          {fetching ? (
            <div className={styles.loaderBox}>Loading blocked pincodes...</div>
          ) : pincodes.length === 0 ? (
            <div className={styles.emptyBox}>No blocked pincodes found.</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr><th>Pincode</th><th>District</th><th>State</th><th>Reason</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {pincodes.map((item) => (
                    <motion.tr key={item._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                      <td><span className={styles.pinBadge}>{item.pincode}</span></td>
                      <td>{item.district}</td>
                      <td>{item.state}</td>
                      <td>{item.reason}</td>
                      <td><button className={styles.deleteBtn} onClick={() => handleDelete(item._id)}>Delete</button></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default PincodeManagement;
