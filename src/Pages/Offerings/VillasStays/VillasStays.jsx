import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./VillasStays.module.css";
import { useAuth, useVillas } from "../../../Store/useContext";
import { useNavigate, useLocation } from "react-router-dom";
import VillaCard from "./VillaCard";
import BookingModal from "./BookingModal";
import BookingsTable from "./BookingsTable";
import VillaFormModal from "./VillaFormModal";
import Loader from "../../../Components/Loader";

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

const VillasStays = () => {
  const { villas, bookings, bookVilla, fetchVillas, fetchBookings, addVilla, updateVilla, loading, error } = useVillas();
  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedVilla, setSelectedVilla] = useState(null);
  const [showVillaForm, setShowVillaForm] = useState(false);
  const [editingVilla, setEditingVilla] = useState(null);
  const [prefillData, setPrefillData] = useState(null);

  useEffect(() => { fetchVillas(); fetchBookings(); }, []);

  useEffect(() => {
    if (location.state?.restoreBooking) {
      const data = location.state.bookingData;
      if (data) {
        setSelectedVilla(data.villa);
        setPrefillData(data);
        localStorage.setItem("booking_prefill", JSON.stringify(data));
      }
    }
  }, [location.state]);

  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <motion.section className={styles.villasSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className={styles.container}>
        <motion.div className={styles.hero} variants={fadeUp} initial="initial" animate="animate">
          <h2 className={styles.heading}>Villas & Stays at Maanjoo Farms</h2>
          <p className={styles.subtext}>Immerse yourself in the tranquility of Maanjoo Farms with our exclusive stays.</p>
          {isAdmin && (
            <motion.button className={styles.addVillaBtn} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setEditingVilla(null); setShowVillaForm(true); }}>
              + Add New Villa
            </motion.button>
          )}
        </motion.div>

        <motion.div className={styles.villasGrid} variants={stagger} initial="initial" animate="animate">
          {villas.length === 0 ? (
            <p className={styles.empty}>No villas available</p>
          ) : (
            villas.map((villa) => (
              <VillaCard key={villa._id} villa={villa} bookings={bookings} isAdmin={isAdmin}
                onOpenBooking={() => setSelectedVilla(villa)}
                onEdit={() => { setEditingVilla(villa); setShowVillaForm(true); }}
                onStatusChange={updateVilla} />
            ))
          )}
        </motion.div>

        {isAdmin && bookings.length > 0 && <BookingsTable bookings={bookings} />}

        <AnimatePresence>
          {selectedVilla && (
            <BookingModal villa={selectedVilla} bookings={bookings} onClose={() => setSelectedVilla(null)}
              bookVilla={bookVilla} user={user} token={token} navigate={navigate} prefillData={prefillData} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showVillaForm && (
            <VillaFormModal villa={editingVilla} onClose={() => setShowVillaForm(false)}
              onSubmit={async (data) => {
                if (editingVilla) { await updateVilla(editingVilla._id, data); }
                else { await addVilla(data); }
                fetchVillas(); setShowVillaForm(false);
              }} />
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default VillasStays;
