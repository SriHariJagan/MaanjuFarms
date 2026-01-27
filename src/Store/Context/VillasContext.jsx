import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../useContext";
import { VillasContext } from "../useContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ROOMS_API, BOOKINGS_API } from "../../urls";

const VillasProvider = ({ children }) => {
  const { token, isAdmin } = useAuth();

  const [villas, setVillas] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ------------------ INITIAL LOAD ------------------
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    loadAllData();
  }, [token, isAdmin]);

  // ------------------ MASTER FETCH ------------------
  const loadAllData = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([fetchVillas(), fetchBookings()]);
    } catch (err) {
      // handled inside functions
    } finally {
      setLoading(false);
    }
  };

  // ------------------ FETCH VILLAS ------------------
  const fetchVillas = async () => {
    try {
      const res = await axios.get(`${ROOMS_API}?category=villa`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVillas(res.data);
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to fetch villas";
      setError(msg);
      toast.error(msg, { toastId: "fetch-villas-error" });
      throw err;
    }
  };

  // ------------------ FETCH BOOKINGS ------------------
  const fetchBookings = async () => {
    if (!token) return;

    try {
      const url = isAdmin
        ? `${BOOKINGS_API}/`
        : `${BOOKINGS_API}/my-bookings`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data);
    } catch (err) {
      const msg = isAdmin
        ? err.response?.data?.msg || "Failed to fetch all bookings"
        : err.response?.data?.msg || "Failed to fetch your bookings";

      setBookings([]);
      toast.error(msg, { toastId: "fetch-bookings-error" });
      throw err;
    }
  };

  // ------------------ ADD VILLA ------------------
  const addVilla = async (villaData) => {
    if (!isAdmin) return { success: false, msg: "Unauthorized" };

    try {
      const res = await axios.post(
        ROOMS_API,
        { ...villaData, category: "villa" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Villa added ✅");
      await loadAllData();

      return { success: true, villa: res.data.room };
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to add villa";
      toast.error(msg);
      return { success: false, msg };
    }
  };

  // ------------------ UPDATE VILLA ------------------
  const updateVilla = async (id, updatedData) => {
    if (!isAdmin) return { success: false, msg: "Unauthorized" };

    try {
      await axios.put(`${ROOMS_API}/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Villa updated ✨");
      await loadAllData();

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to update villa";
      toast.error(msg);
      return { success: false, msg };
    }
  };

  // ------------------ DELETE VILLA ------------------
  const deleteVilla = async (id) => {
    if (!isAdmin) return { success: false, msg: "Unauthorized" };

    try {
      await axios.delete(`${ROOMS_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Villa deleted 🗑️");
      await loadAllData();

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to delete villa";
      toast.error(msg);
      return { success: false, msg };
    }
  };

  // ------------------ BOOK VILLA ------------------
  const bookVilla = async (roomId, checkIn, checkOut) => {
    if (!token) return { success: false, msg: "Unauthorized" };

    try {
      const res = await axios.post(
        BOOKINGS_API,
        { roomId, checkIn, checkOut },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Villa booked 🎉");

      // 🔥 Re-sync from backend (no fake local mutation)
      await loadAllData();

      return { success: true, booking: res.data.booking };
    } catch (err) {
      const msg = err.response?.data?.msg || "Booking failed";
      toast.error(msg);
      return { success: false, msg };
    }
  };

  return (
    <VillasContext.Provider
      value={{
        villas,
        bookings,
        loading,
        error,
        fetchVillas,
        fetchBookings,
        addVilla,
        updateVilla,
        deleteVilla,
        bookVilla,
      }}
    >
      {children}
    </VillasContext.Provider>
  );
};

export default VillasProvider;
