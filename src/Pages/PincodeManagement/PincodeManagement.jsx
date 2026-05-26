import React, { useEffect, useState } from "react";
import styles from "./PincodeManagement.module.css";
import axios from "axios";

import { PINCODE_ENDPOINTS } from "../../urls";

const PincodeManagement = () => {
  const [formData, setFormData] = useState({
    pincode: "",
    district: "",
    state: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [pincodes, setPincodes] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================================
     FETCH BLOCKED PINCODES
  ========================================= */

  const fetchBlockedPincodes = async () => {
    try {
      setFetching(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(PINCODE_ENDPOINTS.BLOCKED, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPincodes(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBlockedPincodes();
  }, []);

  /* =========================================
     HANDLE CHANGE
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pincode") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 6) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     ADD PINCODE
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Please enter valid 6 digit pincode");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(PINCODE_ENDPOINTS.BLOCKED, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message);

      setFormData({
        pincode: "",
        district: "",
        state: "",
        reason: "",
      });

      fetchBlockedPincodes();
    } catch (err) {
      console.log(err);

      setError(err?.response?.data?.message || "Unable to add pincode");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     DELETE PINCODE
  ========================================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Remove this blocked pincode?");

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(PINCODE_ENDPOINTS.DELETE(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchBlockedPincodes();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.headerSection}>
        <div>
          <span className={styles.badge}>Delivery Management</span>

          <h1>Restricted Delivery Pincodes</h1>

          <p>Manage locations where delivery service is unavailable.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* =========================================
            LEFT FORM
        ========================================= */}

        <div className={styles.formCard}>
          <div className={styles.cardTop}>
            <h2>Add Restricted Pincode</h2>
            <p>Block delivery access for selected regions.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Pincode</label>

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter Pincode"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>District</label>

              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter District"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>State</label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter State"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Reason</label>

              <textarea
                rows="4"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Delivery restriction reason"
              />
            </div>

            {message && <div className={styles.successBox}>{message}</div>}

            {error && <div className={styles.errorBox}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? "Adding..." : "Add Restricted Pincode"}
            </button>
          </form>
        </div>

        {/* =========================================
            RIGHT TABLE
        ========================================= */}

        <div className={styles.listCard}>
          <div className={styles.cardTop}>
            <h2>Blocked Locations</h2>

            <span className={styles.countBadge}>
              {pincodes.length} Locations
            </span>
          </div>

          {fetching ? (
            <div className={styles.loaderBox}>Loading blocked pincodes...</div>
          ) : pincodes.length === 0 ? (
            <div className={styles.emptyBox}>No blocked pincodes found.</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Pincode</th>
                    <th>District</th>
                    <th>State</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pincodes.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <span className={styles.pinBadge}>{item.pincode}</span>
                      </td>

                      <td>{item.district}</td>

                      <td>{item.state}</td>

                      <td>{item.reason}</td>

                      <td>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PincodeManagement;
