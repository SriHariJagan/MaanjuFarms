// AdminOrders.jsx

import React, { useEffect, useMemo, useState } from "react";

import axios from "axios";

import {
  Search,
  Package,
  CalendarDays,
  User,
  MapPin,
  Truck,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Phone,
  Mail,
  Hotel,
  Filter,
} from "lucide-react";

import styles from "./AdminOrders.module.css";

import { getImageUrl } from "../../../utils/getImageUrl ";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [expandedOrders, setExpandedOrders] = useState({});

  const [updatingId, setUpdatingId] = useState("");

  // =======================================
  // FILTERS
  // =======================================

  const [selectedType, setSelectedType] = useState("orders");

  const [statusFilter, setStatusFilter] = useState("all");

  const [dateFilter, setDateFilter] = useState("all");

  const token = localStorage.getItem("token");

  // =======================================
  // FETCH DATA
  // =======================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [ordersRes, bookingsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/orders/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        axios.get("http://localhost:5000/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setOrders(
        ordersRes.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
      );
      setBookings(
        bookingsRes.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =======================================
  // TOGGLE
  // =======================================

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // =======================================
  // UPDATE ORDER
  // =======================================

  const updateOrder = async (id, data) => {
    try {
      setUpdatingId(id);

      await axios.put(`http://localhost:5000/api/orders/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? {
                ...order,
                ...data,
              }
            : order,
        ),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setUpdatingId("");
    }
  };

  // =======================================
  // UPDATE BOOKING
  // =======================================

  const updateBooking = async (id, data) => {
    try {
      setUpdatingId(id);

      await axios.put(`http://localhost:5000/api/bookings/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id
            ? {
                ...booking,
                ...data,
              }
            : booking,
        ),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setUpdatingId("");
    }
  };

  // =======================================
  // DATE FILTER
  // =======================================

  const filterByDate = (date) => {
    const today = new Date();

    const itemDate = new Date(date);

    if (dateFilter === "today") {
      return itemDate.toDateString() === today.toDateString();
    }

    if (dateFilter === "week") {
      const weekAgo = new Date();

      weekAgo.setDate(today.getDate() - 7);

      return itemDate >= weekAgo;
    }

    if (dateFilter === "month") {
      return (
        itemDate.getMonth() === today.getMonth() &&
        itemDate.getFullYear() === today.getFullYear()
      );
    }

    return true;
  };

  // =======================================
  // FILTERED DATA
  // =======================================

  const filteredData = useMemo(() => {
    const data = selectedType === "orders" ? orders : bookings;

    return data.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch =
        item.user?.name?.toLowerCase().includes(query) ||
        item.user?.email?.toLowerCase().includes(query) ||
        item._id?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;

      const matchesDate = filterByDate(item.createdAt);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, bookings, search, selectedType, statusFilter, dateFilter]);

  // =======================================
  // LOADING
  // =======================================

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.adminOrders}>
      {/* ======================================= */}
      {/* HEADER */}
      {/* ======================================= */}

      <div className={styles.header}>
        <div>
          <p className={styles.subTitle}>Dashboard / Management</p>

          <h2>
            {selectedType === "orders"
              ? "Orders Management"
              : "Villa Bookings Management"}
          </h2>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.searchBox}>
            <Search size={18} />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ======================================= */}
      {/* FILTERS */}
      {/* ======================================= */}

      <div className={styles.filtersWrapper}>
        {/* TYPE FILTER */}

        <div className={styles.typeTabs}>
          <button
            className={selectedType === "orders" ? styles.activeTab : ""}
            onClick={() => setSelectedType("orders")}
          >
            <Package size={18} />
            Product Orders
          </button>

          <button
            className={selectedType === "bookings" ? styles.activeTab : ""}
            onClick={() => setSelectedType("bookings")}
          >
            <Hotel size={18} />
            Villa Bookings
          </button>
        </div>

        {/* STATUS */}

        <div className={styles.filterGroup}>
          <Filter size={16} />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>

            <option value="pending">Pending</option>

            <option value="confirmed">Confirmed</option>

            <option value="shipped">Shipped</option>

            <option value="delivered">Delivered</option>

            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* DATE */}

        <div className={styles.filterGroup}>
          <CalendarDays size={16} />

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Time</option>

            <option value="today">Today</option>

            <option value="week">Last 7 Days</option>

            <option value="month">This Month</option>
          </select>
        </div>

        <div className={styles.totalOrders}>{filteredData.length} Results</div>
      </div>

      {/* ======================================= */}
      {/* PRODUCT ORDERS */}
      {/* ======================================= */}

      {selectedType === "orders" && (
        <div className={styles.ordersGrid}>
          {filteredData.map((order) => {
            const isExpanded = expandedOrders[order._id];

            return (
              <div className={styles.orderCard} key={order._id}>
                {/* TOP */}

                <div className={styles.topSection}>
                  <div className={styles.orderLeft}>
                    <div className={styles.orderIcon}>
                      <Package size={26} />
                    </div>

                    <div>
                      <p className={styles.label}>ORDER ID</p>

                      <h3>#{order._id.slice(-8)}</h3>

                      <div className={styles.dateRow}>
                        <CalendarDays size={15} />

                        <span>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`${styles.status} ${styles[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                {/* CUSTOMER */}

                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Customer Details</div>

                  <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                      <User size={20} />

                      <div>
                        <label>Name</label>

                        <p>{order.user?.name}</p>
                      </div>
                    </div>

                    <div className={styles.infoCard}>
                      <Mail size={20} />

                      <div>
                        <label>Email</label>

                        <p>{order.user?.email}</p>
                      </div>
                    </div>

                    <div className={styles.infoCard}>
                      <Phone size={20} />

                      <div>
                        <label>Phone</label>

                        <p>{order.deliveryAddress?.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${styles.section} ${styles.infoCard}` }>
                  <MapPin size={20} />
                  <div>
                    <label>Address</label>
                    <p>{order.formattedAddress}</p>
                  </div>
                </div>

                {/* PRODUCTS */}

                <div className={styles.orderDropdown}>
                  <button
                    className={styles.dropdownButton}
                    onClick={() => toggleOrder(order._id)}
                  >
                    <span>Ordered Products ({order.products.length})</span>

                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>

                  {isExpanded && (
                    <div className={styles.dropdownContent}>
                      <div className={styles.productsWrapper}>
                        {order.products.map((item) => (
                          <div className={styles.productCard} key={item._id}>
                            <img
                              src={getImageUrl(item.product?.image)}
                              alt=""
                            />

                            <h4>{item.product?.name}</h4>

                            <p>Qty: {item.quantity}</p>

                            <b>₹{item.product?.price}</b>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* PAYMENT */}

                <div className={styles.paymentSection}>
                  <div>
                    <label>Total Amount</label>

                    <h3>₹{order.totalAmount}</h3>
                  </div>

                  <div>
                    <label>Payment</label>

                    <span
                      className={`${styles.paymentBadge} ${
                        order.paymentStatus === "paid"
                          ? styles.paid
                          : styles.pendingPayment
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* STATUS */}

                <div className={styles.bottomActions}>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrder(order._id, {
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="pending">Pending</option>

                    <option value="confirmed">Confirmed</option>

                    <option value="shipped">Shipped</option>

                    <option value="delivered">Delivered</option>

                    <option value="cancelled">Cancelled</option>
                  </select>

                  {updatingId === order._id && <span>Updating...</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================= */}
      {/* BOOKINGS */}
      {/* ======================================= */}

      {selectedType === "bookings" && (
        <div className={styles.ordersGrid}>
          {filteredData.map((booking) => (
            <div className={styles.orderCard} key={booking._id}>
              {/* TOP */}

              <div className={styles.topSection}>
                <div className={styles.orderLeft}>
                  <div className={styles.orderIcon}>
                    <Hotel size={26} />
                  </div>

                  <div>
                    <p className={styles.label}>BOOKING ID</p>

                    <h3>#{booking._id.slice(-8)}</h3>

                    <div className={styles.dateRow}>
                      <CalendarDays size={15} />

                      <span>
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`${styles.status} ${styles[booking.status]}`}>
                  {booking.status}
                </span>
              </div>

              {/* CUSTOMER */}

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Customer Details</div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoCard}>
                    <User size={20} />

                    <div>
                      <label>Name</label>

                      <p>{booking.user?.name}</p>
                    </div>
                  </div>

                  <div className={styles.infoCard}>
                    <Mail size={20} />

                    <div>
                      <label>Email</label>

                      <p>{booking.user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* VILLA DETAILS */}

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Villa Details</div>

                <div className={styles.addressBox}>
                  <Hotel size={22} />

                  <div>
                    <p>{booking.room?.name}</p>

                    <span>
                      Check In: {new Date(booking.checkIn).toLocaleDateString()}
                    </span>

                    <br />

                    <span>
                      Check Out:{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* GUESTS */}

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Guest Details</div>
                <div className={styles.guestSection}>
                  {booking.guestDetails?.map((guest, index) => (
                    <div
                      className={`${styles.infoCard} ${styles.guestCard}`}
                      key={index}
                    >
                      <User size={18} />

                      <div>
                        <p>{guest.name}</p>

                        <span>
                          {guest.age} yrs • {guest.gender}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PAYMENT */}

              <div className={styles.paymentSection}>
                <div>
                  <label>Total Amount</label>

                  <h3>₹{booking.totalAmount}</h3>
                </div>

                <div>
                  <label>Payment</label>

                  <span
                    className={`${styles.paymentBadge} ${
                      booking.paymentStatus === "paid"
                        ? styles.paid
                        : styles.pendingPayment
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>

              {/* STATUS */}

              <div className={styles.bottomActions}>
                <select
                  value={booking.status}
                  onChange={(e) =>
                    updateBooking(booking._id, {
                      status: e.target.value,
                    })
                  }
                >
                  <option value="pending">Pending</option>

                  <option value="confirmed">Confirmed</option>

                  <option value="cancelled">Cancelled</option>
                </select>

                {updatingId === booking._id && <span>Updating...</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
