import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import styles from "./Cart.module.css";
import { useCart } from "../../../Store/useContext";
import { getImageUrl } from "../../../utils/getImageUrl ";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    subtotal,
    total,
    loading,
  } = useCart();

  return (
    <div className={styles.cartPage}>
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Shopping Cart
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Your selected items are waiting — proceed to complete your order!
          </motion.p>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.cartContent}>
          {cart.length === 0 ? (
            <motion.div
              className={styles.emptyCart}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ShoppingBag size={48} className={styles.emptyIcon} />
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any products yet.</p>
              <button
                className={styles.continueShopping}
                onClick={() => navigate("/organic-products")}
              >
                Start Shopping
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.product._id}
                  className={styles.cartItem}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    <XCircle size={18} />
                  </button>

                  <div className={styles.itemImage}>
                    <img
                      src={getImageUrl(item.product.image) || "/Images/image.png"}
                      alt={item.product.name}
                    />
                  </div>

                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemName}>{item.product.name}</h4>
                    <p className={styles.itemPrice}>
                      ₹{(item.product.price || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className={styles.quantityControl}>
                    <button
                      onClick={() => decreaseQty(item.product._id)}
                      className={styles.qtyBtn}
                    >
                      <Minus size={14} />
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.product._id)}
                      className={styles.qtyBtn}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className={styles.itemSubtotal}>
                    ₹{((item.product.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {cart.length > 0 && (
          <motion.div
            className={styles.summary}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3>Order Summary</h3>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal().toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.freeShipping}>Free</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>₹{total()}</span>
            </div>

            <button
              className={styles.checkoutBtn}
              onClick={() => navigate("/checkout")}
              disabled={loading || cart.length <= 0}
            >
              {loading ? "Redirecting..." : "Proceed to Checkout"}
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
