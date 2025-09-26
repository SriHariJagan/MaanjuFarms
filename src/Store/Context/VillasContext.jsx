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


  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchVillas();
    fetchBookings();
  }, [token, isAdmin]);

  const fetchVillas = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${ROOMS_API}?category=villa`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVillas(res.data);
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to fetch villas";
      setError(msg);
      toast.error(msg, { toastId: "fetch-villas-error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!token) return;

    try {
      const url = isAdmin ? `${BOOKINGS_API}/` : `${BOOKINGS_API}/my-bookings`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      const msg = isAdmin
        ? err.response?.data?.msg || "Failed to fetch all bookings (Admin)"
        : err.response?.data?.msg || "Failed to fetch your bookings";
      setBookings([]);
      toast.error(msg, { toastId: "fetch-bookings-error" });
    }
  };

  const addVilla = async (villaData) => {
    if (!isAdmin) return { success: false, msg: "Unauthorized" };

    try {
      const res = await axios.post(
        ROOMS_API,
        { ...villaData, category: "villa" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVillas((prev) => [...prev, res.data.room]);
      toast.success("Villa added ✅", { toastId: "add-villa" });
      return { success: true, villa: res.data.room };
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to add villa";
      toast.error(msg, { toastId: "add-villa-error" });
      return { success: false, msg };
    }
  };

  const updateVilla = async (id, updatedData) => {
    if (!isAdmin) return { success: false, msg: "Unauthorized" };

    try {
      const res = await axios.put(`${ROOMS_API}/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVillas((prev) => prev.map((v) => (v._id === id ? res.data.room : v)));
      toast.success("Villa updated ✨", { toastId: `update-villa-${id}` });
      return { success: true, villa: res.data.room };
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to update villa";
      toast.error(msg, { toastId: `update-villa-error-${id}` });
      return { success: false, msg };
    }
  };

  const deleteVilla = async (id) => {
    if (!isAdmin) return { success: false, msg: "Unauthorized" };

    try {
      await axios.delete(`${ROOMS_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVillas((prev) => prev.filter((v) => v._id !== id));
      toast.success("Villa deleted 🗑️", { toastId: `delete-villa-${id}` });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to delete villa";
      toast.error(msg, { toastId: `delete-villa-error-${id}` });
      return { success: false, msg };
    }
  };

  const bookVilla = async (roomId, checkIn, checkOut) => {
    if (!token) return { success: false, msg: "Unauthorized" };

    try {
      const res = await axios.post(
        BOOKINGS_API,
        { roomId, checkIn, checkOut },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newBooking = res.data.booking;

      // Update bookings and villa status
      setBookings((prev) => [...prev, newBooking]);
      setVillas((prev) =>
        prev.map((v) => (v._id === roomId ? { ...v, status: "booked" } : v))
      );

      toast.success("Villa booked 🎉", { toastId: `book-villa-${roomId}` });
      return { success: true, booking: newBooking };
    } catch (err) {
      const msg = err.response?.data?.msg || "Booking failed";
      toast.error(msg, { toastId: `book-villa-error-${roomId}` });
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
