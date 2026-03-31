import React, { useState, useEffect } from "react";
import styles from "./VillasStays.module.css";
import { useAuth, useVillas } from "../../../Store/useContext";
import { useNavigate } from "react-router-dom";

import VillaCard from "./VillaCard";
import BookingModal from "./BookingModal";
import BookingsTable from "./BookingsTable";
import VillaFormModal from "./VillaFormModal";
import Loader from "../../../Components/Loader";

const VillasStays = () => {
  const {
    villas,
    bookings,
    bookVilla,
    fetchVillas,
    fetchBookings,
    addVilla,
    updateVilla,
    loading,
    error,
  } = useVillas();

  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [selectedVilla, setSelectedVilla] = useState(null);
  const [showVillaForm, setShowVillaForm] = useState(false);
  const [editingVilla, setEditingVilla] = useState(null);

  useEffect(() => {
    fetchVillas();
    fetchBookings();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <section className={styles.villasSection}>
      <div className={styles.container}>
        {/* HERO */}
        <div className={styles.hero}>
          <h2 className={styles.heading}>Villas & Stays at Maanjoo Farms</h2>
          <p className={styles.subtext}>
            Immerse yourself in the tranquility of Maanjoo Farms with our exclusive stays.
          </p>

          {isAdmin && (
            <button
              className={styles.addVillaBtn}
              onClick={() => {
                setEditingVilla(null);
                setShowVillaForm(true);
              }}
            >
              + Add New Villa
            </button>
          )}
        </div>

        {/* GRID */}
        <div className={styles.villasGrid}>
          {villas.length === 0 ? (
            <p className={styles.empty}>No villas available</p>
          ) : (
            villas.map((villa) => (
              <VillaCard
                key={villa._id}
                villa={villa}
                bookings={bookings}
                isAdmin={isAdmin}
                onOpenBooking={() => setSelectedVilla(villa)}
                onEdit={() => {
                  setEditingVilla(villa);
                  setShowVillaForm(true);
                }}
                onStatusChange={updateVilla}
              />
            ))
          )}
        </div>

        {/* ADMIN TABLE */}
        {isAdmin && bookings.length > 0 && (
          <BookingsTable bookings={bookings} />
        )}

        {/* BOOKING MODAL */}
        {selectedVilla && (
          <BookingModal
            villa={selectedVilla}
            bookings={bookings}
            onClose={() => setSelectedVilla(null)}
            bookVilla={bookVilla}
            user={user}
            token={token}
            navigate={navigate}
          />
        )}

        {/* ADD / EDIT MODAL */}
        {showVillaForm && (
          <VillaFormModal
            villa={editingVilla}
            onClose={() => setShowVillaForm(false)}
            onSubmit={async (data) => {
              if (editingVilla) {
                await updateVilla(editingVilla._id, data);
              } else {
                await addVilla(data);
              }
              fetchVillas();
              setShowVillaForm(false);
            }}
          />
        )}
      </div>
    </section>
  );
};

export default VillasStays;