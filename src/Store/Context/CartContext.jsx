import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../useContext"; // AuthContext provides token
import "react-toastify/dist/ReactToastify.css";
import { CartContext } from "../useContext";

import { CART_API, PAYMENT_ENDPOINTS } from "../../urls";

const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Add product to cart respecting stock
  const addToCart = async (product, quantity = 1) => {
    if (!token) return toast.error("Please login to add items!");

    const existingItem = cart.find((i) => i.product._id === product._id);
    const currentQty = existingItem ? existingItem.quantity : 0;

    if (currentQty + quantity > product.stock) {
      return toast.warn(`Only ${product.stock} units of ${product.name} available`);
    }

    setCart((prev) =>
      existingItem
        ? prev.map((i) =>
            i.product._id === product._id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...prev, { product, quantity }]
    );
    toast.success(`${product.name} added to cart!`);

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

  // Remove product
  const removeFromCart = async (productId) => {
    setCart((prev) => prev.filter((i) => i.product._id !== productId));
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
      fetchCart();
    }
  };

  // Increase quantity respecting stock
  const increaseQty = async (productId) => {
    const item = cart.find((i) => i.product._id === productId);
    if (!item) return;

    if (item.quantity + 1 > item.product.stock) {
      return toast.warn(`Only ${item.product.stock} units of ${item.product.name} available`);
    }

    setCart((prev) =>
      prev.map((i) =>
        i.product._id === productId ? { ...i, quantity: i.quantity + 1 } : i
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
      fetchCart();
    }
  };

  // Decrease quantity
  const decreaseQty = async (productId) => {
    const item = cart.find((i) => i.product._id === productId);
    if (!item) return;

    if (item.quantity <= 1) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.product._id === productId ? { ...i, quantity: i.quantity - 1 } : i
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
        fetchCart();
      }
    }
  };

  const subtotal = () =>
    cart.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0);
  const total = () => subtotal().toFixed(2);

  const handleCheckout = async (address) => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.post(
        PAYMENT_ENDPOINTS.PRODUCT_CHECKOUT,
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to start payment");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Try again.");
      setLoading(false);
    }
  };

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
        handleCheckout,
        fetchCart,
        setCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;