import { useState } from "react";
import { CartContext } from "../useContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // Add product to cart
  const addToCart = (product) => {
    const productWithPrice = { ...product, price: product.price || 100 }; // default price
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === productWithPrice.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === productWithPrice.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevCart, { ...productWithPrice, qty: 1 }];
      }
    });
    toast.success(`${product.name} added to cart!`);
  };

  // Remove product
  const removeFromCart = (id) => {
    const removedItem = cart.find((item) => item.id === id);
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.info(`${removedItem?.name} removed from cart`);
  };

  // Increase quantity
  const increaseQty = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // Decrease quantity
  const decreaseQty = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // Apply coupon
  const applyCoupon = (code) => {
    if (code === "SAVE10") {
      const discountAmount = subtotal() * 0.1;
      setDiscount(discountAmount);
      toast.success(`Coupon applied! You saved ₹${discountAmount.toFixed(2)}`);
    } else {
      setDiscount(0);
      toast.error("Invalid Coupon");
    }
  };

  // Cart totals
  const subtotal = () =>
    cart.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);

  const total = () => (subtotal() - discount).toFixed(2);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        coupon,
        setCoupon,
        discount,
        applyCoupon,
        subtotal,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
