import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../useContext"; // AuthContext provides token
import { VillasContext } from "../useContext"; // React context
import { ROOMS_API, BOOKINGS_API, PAYMENT_ENDPOINTS } from "../../urls";
import "react-toastify/dist/ReactToastify.css";

const VillasProvider = ({ children }) => {
  const { token, isAdmin } = useAuth();

  const [villas, setVillas] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================== AXIOS INSTANCE ==================
  const api = useMemo(
    () =>
      axios.create({
        baseURL: "",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      }),
    [token]
  );

  // ================== FETCH VILLAS ==================
  const fetchVillas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${ROOMS_API}?category=villa`);
      setVillas(res.data.rooms || []);
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to fetch villas";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [api]);

  // ================== FETCH BOOKINGS ==================
  const fetchBookings = useCallback(async () => {
    if (!token) return;

    try {
      const url = isAdmin ? BOOKINGS_API : `${BOOKINGS_API}/my-bookings`;
      const res = await api.get(url);
      setBookings(res.data || []);
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to fetch bookings";
      setBookings([]);
      toast.error(msg);
    }
  }, [api, token, isAdmin]);

  // ================== ADD / UPDATE / DELETE VILLA ==================
  const addVilla = async (villaData) => {
    if (!isAdmin) return toast.error("Unauthorized");

    try {
      const res = await api.post(ROOMS_API, { ...villaData, category: "villa" });
      setVillas((prev) => [...prev, res.data.room]);
      toast.success("Villa added ✅");
      return res.data.room;
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to add villa");
    }
  };

  const updateVilla = async (id, updatedData) => {
    if (!isAdmin) return toast.error("Unauthorized");

    try {
      const res = await api.put(`${ROOMS_API}/${id}`, updatedData);
      setVillas((prev) =>
        prev.map((v) => (v._id === id ? res.data.room : v))
      );
      toast.success("Villa updated ✨");
      return res.data.room;
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update villa");
    }
  };

  const deleteVilla = async (id) => {
    if (!isAdmin) return toast.error("Unauthorized");

    try {
      await api.delete(`${ROOMS_API}/${id}`);
      setVillas((prev) => prev.filter((v) => v._id !== id));
      toast.success("Villa deleted 🗑️");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete villa");
    }
  };

  // ================== BOOK VILLA ==================
const bookVilla = async (villaId, checkIn, checkOut, guests = 1) => {
  if (!token) return toast.error("Login required");


  try {
    const res = await api.post(
      PAYMENT_ENDPOINTS.BOOKING_CHECKOUT,
      {
        villaId,
        checkIn,
        checkOut,
        guests,
      }
    );

    if (!res.data?.url) throw new Error("Payment failed");
    console.log("villaid:", villaId, "checkin:", checkIn, "checkout: ", checkOut)


    window.location.href = res.data.url;


  } catch (err) {
    toast.error(err.response?.data?.msg || err.message);
  }
};

  // ================== CONTEXT VALUE ==================
  const value = {
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
  };

  // ================== INITIAL LOAD ==================
  useEffect(() => {
    if (!token) return;
    fetchVillas();
    fetchBookings();
  }, [token, isAdmin]);

  return <VillasContext.Provider value={value}>{children}</VillasContext.Provider>;
};

export default VillasProvider;