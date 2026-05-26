// UserOrders.jsx

import React, { useEffect, useState } from "react";

import axios from "axios";

import {
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  BadgeCheck,
} from "lucide-react";

import styles from "./UserOrders.module.css";
import { getImageUrl } from "../../../utils/getImageUrl ";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  const [expandedOrders, setExpandedOrders] = useState({});

  const token = localStorage.getItem("token");

  //
  // FETCH ORDERS
  //

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  //
  // TOGGLE CARD
  //

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={styles.userOrders}>
      {/* HEADER */}

      <div className={styles.header}>
        <div>
          <h2>My Orders</h2>
        </div>

        <div className={styles.totalOrders}>{orders.length} Orders</div>
      </div>

      {/* ORDERS */}

      <div className={styles.ordersWrapper}>
        {orders.map((order) => {
          const isOpen = expandedOrders[order._id];

          return (
            <div className={styles.orderCard} key={order._id}>
              {/* TOP SUMMARY */}

              <div
                className={styles.orderSummary}
                onClick={() => toggleOrder(order._id)}
              >
                {/* LEFT */}

                <div className={styles.summaryLeft}>
                  <div className={styles.orderIcon}>
                    <Package size={22} />
                  </div>

                  <div>
                    <h3>Order #{order._id.slice(-8)}</h3>

                    <p>
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* CENTER */}

                <div className={styles.summaryCenter}>
                  <div>
                    <label>Total</label>

                    <h4>₹{order.totalAmount}</h4>
                  </div>

                  <div>
                    <label>Products</label>

                    <h4>{order.products.length}</h4>
                  </div>
                </div>

                {/* RIGHT */}

                <div className={styles.summaryRight}>
                  <span className={`${styles.status} ${styles[order.status]}`}>
                    {order.status}
                  </span>

                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              {/* DETAILS */}

              {isOpen && (
                <div className={styles.orderDetails}>
                  {/* PRODUCTS */}

                  <div className={styles.section}>
                    <div className={styles.sectionTitle}>Ordered Products</div>

                    <div className={styles.productsWrapper}>
                      {order.products.map((item) => (
                        <div className={styles.productItem} key={item._id}>
                          {console.log(item.product?.image)}
                          <div className={styles.productImageWrapper}>
                            <img src={getImageUrl(item.product?.image)} alt="" />
                          </div>

                          <div className={styles.productContent}>
                            <h4>{item.product?.name}</h4>

                            <p>
                              Quantity :<span>{item.quantity}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PAYMENT */}

                  <div className={styles.paymentSection}>
                    <div>
                      <label>Payment Status</label>

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

                    <div>
                      <label>Order Status</label>

                      <div className={styles.statusInfo}>
                        {order.status === "delivered" ? (
                          <BadgeCheck size={18} />
                        ) : (
                          <Truck size={18} />
                        )}

                        <p>{order.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* SHIPPING */}

                  {(order.trackingId || order.courierName) && (
                    <div className={styles.section}>
                      <div className={styles.sectionTitle}>
                        Shipping Details
                      </div>

                      <div className={styles.shippingBox}>
                        {order.trackingId && (
                          <div className={styles.shippingItem}>
                            <label>Tracking ID</label>

                            <p>{order.trackingId}</p>
                          </div>
                        )}

                        {order.courierName && (
                          <div className={styles.shippingItem}>
                            <label>Courier</label>

                            <p>{order.courierName}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ADDRESS */}

                  <div className={styles.section}>
                    <div className={styles.sectionTitle}>Delivery Address</div>

                    <div className={styles.addressBox}>
                      {order.formattedAddress}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserOrders;
