import React from "react";
import { XCircle, Minus, Plus } from "lucide-react";
import styles from "./Cart.module.css";
import { useCart } from "../../Store/useContext";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty, subtotal, total } = useCart();

  return (
    <>
      <section className={`${styles.pageHeader} ${styles.aboutHeader}`}>
        <h2>Cart</h2>
        <p>Your selected items are waiting — proceed to complete your order!</p>
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
              <tr key={item.product._id}>
                <td>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className={styles.removeProductBtn}
                  >
                    <XCircle size={20} strokeWidth={2} />
                  </button>
                </td>
                <td>
                  <img src={item.product.image || "/images/default.png"} alt={item.product.name} />
                </td>
                <td className={styles.productName}>{item.product.name}</td>
                <td>₹{(item.product.price || 0).toFixed(2)}</td>
                <td>
                  <div>
                    <button
                      onClick={() => decreaseQty(item.product._id)}
                      className={styles.countProductBtn}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={{ margin: "0 15px", fontSize: "1.2rem" }}>{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.product._id)}
                      className={styles.countProductBtn}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </td>
                <td>₹{((item.product.price || 0) * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={`${styles.addCart} ${styles.sectionP1}`}>
        <div className={styles.subtotal}>
          <h3>Cart Totals</h3>
          <table>
            <tbody>
              <tr>
                <td>Cart Subtotal</td>
                <td>₹{subtotal().toFixed(2)}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>Free</td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>₹{total()}</strong></td>
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
