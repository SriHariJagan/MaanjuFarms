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
} from "lucide-react";

import styles from "./AdminOrders.module.css";

import { getImageUrl } from "../../../utils/getImageUrl ";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [expandedOrders, setExpandedOrders] = useState({});

  const [updatingId, setUpdatingId] = useState("");

  const token = localStorage.getItem("token");

  //
  // FETCH ORDERS
  //

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedOrders = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setOrders(sortedOrders);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  //
  // TOGGLE
  //

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  //
  // UPDATE ORDER
  //

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

  //
  // SEARCH
  //

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();

      return (
        order.user?.name?.toLowerCase().includes(query) ||
        order.user?.email?.toLowerCase().includes(query) ||
        order._id?.toLowerCase().includes(query)
      );
    });
  }, [orders, search]);

  //
  // LOADING
  //

  if (loading) {
    return <div className={styles.loading}>Loading Orders...</div>;
  }

  return (
    <div className={styles.adminOrders}>
      {/* HEADER */}

      <div className={styles.header}>
        <div>
          <p className={styles.subTitle}>Dashboard / Orders</p>

          <h2>Orders Management</h2>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.searchBox}>
            <Search size={18} />

            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.totalOrders}>
            {filteredOrders.length} Orders
          </div>
        </div>
      </div>

      {/* ORDERS */}

      <div className={styles.ordersGrid}>
        {filteredOrders.map((order) => {
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

              {/* ADDRESS */}

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Delivery Address</div>

                <div className={styles.addressBox}>
                  <MapPin size={22} />

                  <div>
                    <p>{order.deliveryAddress?.name}</p>

                    <span>{order.formattedAddress}</span>
                  </div>
                </div>
              </div>

              {/* PRODUCTS */}

              <div className={styles.orderDropdown}>
                <button
                  className={styles.dropdownButton}
                  onClick={() => toggleOrder(order._id)}
                >
                  <div className={styles.dropdownLeft}>
                    <div className={styles.dropdownIcon}>
                      <Package size={18} />
                    </div>

                    <span>Ordered Products ({order.products.length})</span>
                  </div>

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
                          <div className={styles.productImageWrapper}>
                            <img
                              src={getImageUrl(item.product?.image)}
                              alt=""
                            />

                            <div className={styles.productQuantity}>
                              Qty {item.quantity}
                            </div>
                          </div>

                          <div className={styles.productContent}>
                            <h4>{item.product?.name}</h4>

                            <div className={styles.productFooter}>
                              <div className={styles.productPrice}>
                                <span>Price</span>

                                <b>₹{item.product?.price}</b>
                              </div>

                              <div className={styles.productStatus}>
                                In Stock
                              </div>
                            </div>
                          </div>
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
                    {order.paymentStatus === "paid" ? (
                      <BadgeCheck size={15} />
                    ) : (
                      <Truck size={15} />
                    )}

                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* SHIPPING */}

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Shipping Details</div>

                <div className={styles.shippingGrid}>
                  <input
                    type="text"
                    placeholder="Tracking ID"
                    defaultValue={order.trackingId}
                    onBlur={(e) =>
                      updateOrder(order._id, {
                        trackingId: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Courier Name"
                    defaultValue={order.courierName}
                    onBlur={(e) =>
                      updateOrder(order._id, {
                        courierName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* BOTTOM */}

              <div className={styles.bottomActions}>
                <div className={styles.statusBox}>
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

                  {updatingId === order._id && (
                    <span className={styles.updating}>Updating...</span>
                  )}
                </div>

                {order.status === "delivered" && (
                  <div className={styles.deliveredBadge}>
                    <BadgeCheck size={16} />
                    Delivered
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrders;
