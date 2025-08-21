import React from "react";
import { XCircle, Minus, Plus } from "lucide-react";
import styles from "./Cart.module.css";
import { useCart } from "../../Store/useContext";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    coupon,
    setCoupon,
    discount,
    applyCoupon,
    subtotal,
    total,
  } = useCart();

  return (
    <>
      <section className={`${styles.pageHeader} ${styles.aboutHeader}`}>
        <h2>Cart</h2>
        <p>Add Your Coupon Code & SAVE up to 75%!</p>
      </section>

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
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={styles.removeProductBtn}
                  >
                    <XCircle size={20} strokeWidth={2} />
                  </button>
                </td>
                <td>
                  <img src={item.image || item.img} alt={item.name} />
                </td>
                <td className={styles.productName}>{item.name}</td>
                <td>${(item.price || 0).toFixed(2)}</td>
                <td>
                  <div>
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className={styles.countProductBtn}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={{ margin: "0 10px" }}>{item.qty}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className={styles.countProductBtn}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </td>
                <td>${((item.price || 0) * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

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
            <button
              className={styles.normal}
              onClick={() => {
                if (!coupon.trim()) {
                  // ✅ Show error if input is empty
                  toast.error("Please enter a coupon code");
                  return;
                }
                applyCoupon(coupon);
              }}
            >
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
                <td>${subtotal().toFixed(2)}</td>
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
                  <strong>${total()}</strong>
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
