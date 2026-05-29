// UserOrders.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  BadgeCheck,
  Building2,
  CalendarDays,
  Users,
  CreditCard,
  MapPin,
} from "lucide-react";

import styles from "./UserOrders.module.css";

import { getImageUrl } from "../../../utils/getImageUrl ";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [expandedOrders, setExpandedOrders] =
    useState({});

  const [activeTab, setActiveTab] =
    useState("orders");

  const token = localStorage.getItem("token");

  // =====================================
  // FETCH DATA
  // =====================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [ordersRes, bookingsRes] =
        await Promise.all([
          axios.get(
            "http://localhost:5000/api/orders/my-orders",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          ),

          axios.get(
            "http://localhost:5000/api/bookings/my-bookings",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          ),
        ]);

      setOrders(ordersRes.data);

      setBookings(bookingsRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================
  // TOGGLE
  // =====================================

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // =====================================
  // FILTERED DATA
  // =====================================

  const currentData = useMemo(() => {
    return activeTab === "orders"
      ? orders
      : bookings;
  }, [
    activeTab,
    orders,
    bookings,
  ]);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading...
      </div>
    );
  }

  return (
    <div className={styles.userOrders}>
      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className={styles.header}>
        <div>
          <h2>
            {activeTab === "orders"
              ? "My Product Orders"
              : "My Villa Bookings"}
          </h2>

          <p>
            Track your orders and booking
            status
          </p>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.switchTabs}>
            <button
              className={`${
                activeTab === "orders"
                  ? styles.activeTab
                  : ""
              }`}
              onClick={() =>
                setActiveTab("orders")
              }
            >
              <Package size={18} />
              Product Orders
            </button>

            <button
              className={`${
                activeTab === "bookings"
                  ? styles.activeTab
                  : ""
              }`}
              onClick={() =>
                setActiveTab("bookings")
              }
            >
              <Building2 size={18} />
              Villa Bookings
            </button>
          </div>

          <div className={styles.totalOrders}>
            {currentData.length} Records
          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* PRODUCT ORDERS */}
      {/* ===================================== */}

      {activeTab === "orders" && (
        <div className={styles.ordersWrapper}>
          {orders.map((order) => {
            const isOpen =
              expandedOrders[order._id];

            return (
              <div
                className={styles.orderCard}
                key={order._id}
              >
                {/* SUMMARY */}

                <div
                  className={styles.orderSummary}
                  onClick={() =>
                    toggleOrder(order._id)
                  }
                >
                  {/* LEFT */}

                  <div
                    className={styles.summaryLeft}
                  >
                    <div
                      className={styles.orderIcon}
                    >
                      <Package size={22} />
                    </div>

                    <div>
                      <h3>
                        Order #
                        {order._id.slice(-8)}
                      </h3>

                      <p>
                        Ordered on{" "}
                        {new Date(
                          order.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* CENTER */}

                  <div
                    className={styles.summaryCenter}
                  >
                    <div>
                      <label>Total</label>

                      <h4>
                        ₹{order.totalAmount}
                      </h4>
                    </div>

                    <div>
                      <label>Products</label>

                      <h4>
                        {
                          order.products
                            .length
                        }
                      </h4>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div
                    className={styles.summaryRight}
                  >
                    <span
                      className={`${
                        styles.status
                      } ${
                        styles[order.status]
                      }`}
                    >
                      {order.status}
                    </span>

                    {isOpen ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>
                </div>

                {/* DETAILS */}

                {isOpen && (
                  <div
                    className={styles.orderDetails}
                  >
                    {/* PRODUCTS */}

                    <div
                      className={styles.section}
                    >
                      <div
                        className={
                          styles.sectionTitle
                        }
                      >
                        Ordered Products
                      </div>

                      <div
                        className={
                          styles.productsWrapper
                        }
                      >
                        {order.products.map(
                          (item) => (
                            <div
                              className={
                                styles.productItem
                              }
                              key={item._id}
                            >
                              <div
                                className={
                                  styles.productImageWrapper
                                }
                              >
                                <img
                                  src={getImageUrl(
                                    item.product
                                      ?.image,
                                  )}
                                  alt=""
                                />
                              </div>

                              <div
                                className={
                                  styles.productContent
                                }
                              >
                                <h4>
                                  {
                                    item.product
                                      ?.name
                                  }
                                </h4>

                                <p>
                                  Quantity :
                                  <span>
                                    {
                                      item.quantity
                                    }
                                  </span>
                                </p>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* PAYMENT */}

                    <div
                      className={
                        styles.paymentSection
                      }
                    >
                      <div>
                        <label>
                          Payment Status
                        </label>

                        <span
                          className={`${
                            styles.paymentBadge
                          } ${
                            order.paymentStatus ===
                            "paid"
                              ? styles.paid
                              : styles.pendingPayment
                          }`}
                        >
                          {
                            order.paymentStatus
                          }
                        </span>
                      </div>

                      <div>
                        <label>
                          Order Status
                        </label>

                        <div
                          className={
                            styles.statusInfo
                          }
                        >
                          {order.status ===
                          "delivered" ? (
                            <BadgeCheck
                              size={18}
                            />
                          ) : (
                            <Truck
                              size={18}
                            />
                          )}

                          <p>
                            {order.status}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SHIPPING */}

                    {(order.trackingId ||
                      order.courierName) && (
                      <div
                        className={
                          styles.section
                        }
                      >
                        <div
                          className={
                            styles.sectionTitle
                          }
                        >
                          Shipping Details
                        </div>

                        <div
                          className={
                            styles.shippingBox
                          }
                        >
                          {order.trackingId && (
                            <div
                              className={
                                styles.shippingItem
                              }
                            >
                              <label>
                                Tracking ID
                              </label>

                              <p>
                                {
                                  order.trackingId
                                }
                              </p>
                            </div>
                          )}

                          {order.courierName && (
                            <div
                              className={
                                styles.shippingItem
                              }
                            >
                              <label>
                                Courier
                              </label>

                              <p>
                                {
                                  order.courierName
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ADDRESS */}

                    <div
                      className={styles.section}
                    >
                      <div
                        className={
                          styles.sectionTitle
                        }
                      >
                        Delivery Address
                      </div>

                      <div
                        className={styles.addressBox}
                      >
                        <MapPin size={18} />

                        <span>
                          {
                            order.formattedAddress
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===================================== */}
      {/* BOOKINGS */}
      {/* ===================================== */}

      {activeTab === "bookings" && (
        <div className={styles.ordersWrapper}>
          {bookings.map((booking) => {
            const isOpen =
              expandedOrders[booking._id];

            return (
              <div
                className={styles.orderCard}
                key={booking._id}
              >
                {/* SUMMARY */}

                <div
                  className={styles.orderSummary}
                  onClick={() =>
                    toggleOrder(booking._id)
                  }
                >
                  {/* LEFT */}

                  <div
                    className={styles.summaryLeft}
                  >
                    <div
                      className={styles.orderIcon}
                    >
                      <Building2 size={22} />
                    </div>

                    <div>
                      <h3>
                        Booking #
                        {booking._id.slice(
                          -8,
                        )}
                      </h3>

                      <p>
                        Booked on{" "}
                        {new Date(
                          booking.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* CENTER */}

                  <div
                    className={styles.summaryCenter}
                  >
                    <div>
                      <label>Total</label>

                      <h4>
                        ₹
                        {
                          booking.totalAmount
                        }
                      </h4>
                    </div>

                    <div>
                      <label>Guests</label>

                      <h4>
                        {booking.guests}
                      </h4>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div
                    className={styles.summaryRight}
                  >
                    <span
                      className={`${
                        styles.status
                      } ${
                        styles[booking.status]
                      }`}
                    >
                      {booking.status}
                    </span>

                    {isOpen ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>
                </div>

                {/* DETAILS */}

                {isOpen && (
                  <div
                    className={styles.orderDetails}
                  >
                    {/* ROOM */}

                    <div
                      className={styles.roomCard}
                    >
                      <img
                        src={getImageUrl(
                          booking.room?.images?.[0],
                        )}
                        alt=""
                      />

                      <div
                        className={
                          styles.roomContent
                        }
                      >
                        <h3>
                          {
                            booking.room
                              ?.title
                          }
                        </h3>

                        <p>
                          {
                            booking.room
                              ?.location
                          }
                        </p>
                      </div>
                    </div>

                    {/* BOOKING DETAILS */}

                    <div
                      className={styles.bookingGrid}
                    >
                      <div
                        className={styles.bookingInfo}
                      >
                        <CalendarDays
                          size={18}
                        />

                        <div>
                          <label>
                            Check In
                          </label>

                          <p>
                            {new Date(
                              booking.checkIn,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div
                        className={styles.bookingInfo}
                      >
                        <CalendarDays
                          size={18}
                        />

                        <div>
                          <label>
                            Check Out
                          </label>

                          <p>
                            {new Date(
                              booking.checkOut,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div
                        className={styles.bookingInfo}
                      >
                        <Users size={18} />

                        <div>
                          <label>
                            Guests
                          </label>

                          <p>
                            {
                              booking.guests
                            }{" "}
                            Guests
                          </p>
                        </div>
                      </div>

                      <div
                        className={styles.bookingInfo}
                      >
                        <CreditCard
                          size={18}
                        />

                        <div>
                          <label>
                            Payment
                          </label>

                          <p>
                            {
                              booking.paymentStatus
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* GUESTS */}

                    {booking.guestDetails
                      ?.length > 0 && (
                      <div
                        className={
                          styles.section
                        }
                      >
                        <div
                          className={
                            styles.sectionTitle
                          }
                        >
                          Guest Details
                        </div>

                        <div
                          className={
                            styles.guestGrid
                          }
                        >
                          {booking.guestDetails.map(
                            (
                              guest,
                              index,
                            ) => (
                              <div
                                className={
                                  styles.guestCard
                                }
                                key={index}
                              >
                                <h4>
                                  {
                                    guest.name
                                  }
                                </h4>

                                <p>
                                  Age :{" "}
                                  {
                                    guest.age
                                  }
                                </p>

                                <p>
                                  Gender :{" "}
                                  {
                                    guest.gender
                                  }
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserOrders;