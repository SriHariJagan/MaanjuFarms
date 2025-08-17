import React, { useState } from "react";
import { XCircle, Minus, Plus } from "lucide-react"; // ✅ Lucide icons
import styles from "./Cart.module.css";

const Cart = () => {
  // ✅ Dummy Data
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Cartoon Astronaut T-Shirts",
      price: 178.13,
      qty: 1,
      img: "https://amhes.com/wp-content/uploads/2023/02/HOMEY_Marmelade_Strawberry_Vitamins_AMHES-scaled.jpg",
    },
    {
      id: 2,
      name: "Cartoon Astronaut T-Shirts",
      price: 125.56,
      qty: 1,
      img: "https://amhes.com/wp-content/uploads/2023/02/HOMEY_Marmelade_Strawberry_Vitamins_AMHES-scaled.jpg",
    },
    {
      id: 3,
      name: "Cartoon Astronaut T-Shirts",
      price: 208.24,
      qty: 1,
      img: "https://amhes.com/wp-content/uploads/2023/02/HOMEY_Marmelade_Strawberry_Vitamins_AMHES-scaled.jpg",
    },
  ]);

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // ✅ Remove item
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // ✅ Increase qty
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // ✅ Decrease qty (remove if < 1)
  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // ✅ Cart totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = (subtotal - discount).toFixed(2);

  // ✅ Dummy coupon logic
  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(subtotal * 0.1);
    } else {
      setDiscount(0);
      alert("Invalid Coupon");
    }
  };

  return (
    <>
      {/* Page Header */}
      <section className={`${styles.pageHeader} ${styles.aboutHeader}`}>
        <h2>Cart</h2>
        <p>Add Your Coupon Code & SAVE up to 75%!</p>
      </section>

      {/* Cart Table */}
      <section className={`${styles.cart} ${styles.sectionP1}`}>
        <table>
          <thead>
            <tr>
              <td>Remove</td>
              <td>Image</td>
              <td>Product</td>
              <td>Price</td>
              <td>Quantity</td>
              <td>Subtotal</td>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>
                  <button onClick={() => removeItem(item.id)} className={styles.removeProductBtn} >
                    <XCircle size={20} strokeWidth={2} />
                  </button>
                </td>
                <td>
                  <img src={item.img} alt={item.name} />
                </td>
                <td className={styles.productName}>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <div >
                    <button onClick={() => decreaseQty(item.id)} className={styles.countProductBtn}>
                      <Minus size={16} />
                    </button>
                    <span style={{ margin: "0 10px" }}>{item.qty}</span>
                    <button onClick={() => increaseQty(item.id)} className={styles.countProductBtn}>
                      <Plus size={16} />
                    </button>
                  </div>
                </td>
                <td>${(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Coupon & Subtotal */}
      <section className={`${styles.addCart} ${styles.sectionP1}`}>
        <div className={styles.coupon}>
          <h3>Apply Coupon</h3>
          <div className={styles.couponInput}>
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button className={styles.normal} onClick={applyCoupon}>
              APPLY
            </button>
          </div>
        </div>

        <div className={styles.subtotal}>
          <h3>Cart Totals</h3>
          <table>
            <tbody>
              <tr>
                <td>Cart Subtotal</td>
                <td>${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Discount</td>
                <td>${discount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>Free</td>
              </tr>
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>${total}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <button className={styles.normal}>Proceed to Checkout</button>
        </div>
      </section>
    </>
  );
};

export default Cart;
