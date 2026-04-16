import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../useContext";
import { VillasContext } from "../useContext";
import { ROOMS_API, BOOKINGS_API, PAYMENT_ENDPOINTS } from "../../urls";
import { useRazorpayPayment } from "../../hooks/useRazorpayPayment";
import "react-toastify/dist/ReactToastify.css";

const VillasProvider = ({ children }) => {
  const { token, isAdmin } = useAuth();
  const { startPayment } = useRazorpayPayment(token);

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

  // ================== ADMIN ACTIONS ==================
  const addVilla = async (villaData) => {
    if (!isAdmin) return toast.error("Unauthorized");

    try {
      const res = await api.post(ROOMS_API, {
        ...villaData,
        category: "villa",
      });
      setVillas((prev) => [...prev, res.data.room]);
      toast.success("Villa added ✅");
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

  // ================== BOOK VILLA (PRODUCTION) ==================
const bookVilla = async (
  villaId,
  checkIn,
  checkOut,
  guests = 1,
  guestDetails = []
) => {
  if (!token) return toast.error("Login required");
  if (loading) return;

  try {
    setLoading(true);

    if (!villaId || !checkIn || !checkOut) {
      toast.error("Missing booking details");
      return;
    }

    const { data } = await api.post(
      PAYMENT_ENDPOINTS.BOOKING_CHECKOUT,
      { villaId, checkIn, checkOut, guests, guestDetails }
    );

    await startPayment({
      orderData: data,
      verifyUrl: PAYMENT_ENDPOINTS.VERIFY,

      meta: {
        description: "Villa Booking Payment",
      },

      onSuccess: async () => {
        await fetchBookings();

        toast.success("Booking confirmed 🎉");

        window.location.replace("/payment-success?type=booking");
      },

      onFailure: (error) => {
        window.location.replace(
          `/payment-failed?error=${encodeURIComponent(error)}`
        );
      },
    });

  } catch (err) {
    console.error("Booking Error:", err);
    toast.error(err.response?.data?.msg || "Booking failed");
  } finally {
    setLoading(false);
  }
};

  // ================== CONTEXT ==================
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

  return (
    <VillasContext.Provider value={value}>
      {children}
    </VillasContext.Provider>
  );
};

export default VillasProvider;