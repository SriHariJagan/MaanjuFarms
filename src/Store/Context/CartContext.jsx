import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../useContext"; // AuthContext provides token
import "react-toastify/dist/ReactToastify.css";
import { CartContext } from "../useContext";

import { CART_API } from '../../urls';

const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get(CART_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error fetching cart:", err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // Add product locally and then update backend
  const addToCart = async (product, quantity = 1) => {
    if (!token) return toast.error("Please login to add items!");

    // Update local cart first
    setCart(prev =>
      prev.some(i => i.product._id === product._id)
        ? prev.map(i =>
            i.product._id === product._id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...prev, { product, quantity }]
    );
    toast.success(`${product.name} added to cart!`);

    // Update backend
    try {
      await axios.post(
        `${CART_API}/add`,
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync with server");
      fetchCart(); // rollback
    }
  };

  // Remove product locally and then backend
  const removeFromCart = async productId => {
    setCart(prev => prev.filter(i => i.product._id !== productId));
    toast.info("Item removed from cart");

    if (!token) return;
    try {
      await axios.post(
        `${CART_API}/remove`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync with server");
      fetchCart(); // rollback
    }
  };

  // Increase quantity locally first
  const increaseQty = async productId => {
    setCart(prev =>
      prev.map(i =>
        i.product._id === productId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );

    try {
      await axios.post(
        `${CART_API}/add`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync with server");
      fetchCart(); // rollback
    }
  };

  // Decrease quantity locally first
  const decreaseQty = async productId => {
    const item = cart.find(i => i.product._id === productId);
    if (!item) return;

    if (item.quantity <= 1) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(i =>
          i.product._id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
      );

      try {
        await axios.post(
          `${CART_API}/add`,
          { productId, quantity: -1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to sync with server");
        fetchCart(); // rollback
      }
    }
  };

  const subtotal = () =>
    cart.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0);
  const total = () => subtotal().toFixed(2);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        subtotal,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
