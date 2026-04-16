import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../useContext";
import { CartContext } from "../useContext";
import { CART_API, PAYMENT_ENDPOINTS } from "../../urls";
import { useRazorpayPayment } from "../../hooks/useRazorpayPayment";

const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const { startPayment } = useRazorpayPayment(token);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH CART =================
  const fetchCart = async () => {
    if (!token) return;

    try {
      const res = await axios.get(CART_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart || []);
    } catch (err) {
      console.error("Cart fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // ================= ADD TO CART =================
  const addToCart = async (product, quantity = 1) => {
    if (!token) return toast.error("Please login to add items!");

    const existingItem = cart.find((i) => i.product._id === product._id);
    const currentQty = existingItem ? existingItem.quantity : 0;

    if (currentQty + quantity > product.stock) {
      return toast.warn(`Only ${product.stock} units available`);
    }

    // optimistic UI
    setCart((prev) =>
      existingItem
        ? prev.map((i) =>
            i.product._id === product._id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...prev, { product, quantity }]
    );

    try {
      await axios.post(
        `${CART_API}/add`,
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${product.name} added`);
    } catch (err) {
      toast.error("Sync failed");
      fetchCart(); // rollback
    }
  };

  // ================= REMOVE =================
  const removeFromCart = async (productId) => {
    setCart((prev) => prev.filter((i) => i.product._id !== productId));

    try {
      await axios.post(
        `${CART_API}/remove`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info("Item removed");
    } catch (err) {
      toast.error("Sync failed");
      fetchCart();
    }
  };

  // ================= INCREASE =================
  const increaseQty = async (productId) => {
    const item = cart.find((i) => i.product._id === productId);
    if (!item) return;

    if (item.quantity + 1 > item.product.stock) {
      return toast.warn(`Only ${item.product.stock} available`);
    }

    setCart((prev) =>
      prev.map((i) =>
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
    } catch {
      fetchCart();
    }
  };

  // ================= DECREASE =================
  const decreaseQty = async (productId) => {
    const item = cart.find((i) => i.product._id === productId);
    if (!item) return;

    if (item.quantity <= 1) return removeFromCart(productId);

    setCart((prev) =>
      prev.map((i) =>
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
    } catch {
      fetchCart();
    }
  };

  // ================= TOTAL =================
  const subtotal = () =>
    cart.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0);

  const total = () => subtotal().toFixed(2);

  // ================= CHECKOUT =================
const handleCheckout = async (address) => {
  if (loading) return;

  try {
    setLoading(true);

    if (!address) {
      toast.error("Address required");
      return;
    }

    const { data } = await axios.post(
      PAYMENT_ENDPOINTS.PRODUCT_CHECKOUT,
      { address },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await startPayment({
      orderData: data,
      verifyUrl: PAYMENT_ENDPOINTS.VERIFY,

      meta: {
        description: "Product Checkout",
        prefill: {
          name: address?.name || "",
          email: address?.email || "",
          contact: address?.phone || "",
        },
      },

      onSuccess: async () => {
        setCart([]);
        await fetchCart();

        toast.success("Order placed successfully 🎉");

        window.location.replace("/payment-success?type=product");
      },

      onFailure: (error) => {
        window.location.replace(
          `/payment-failed?error=${encodeURIComponent(error)}`
        );
      },
    });

  } catch (err) {
    console.error("Checkout Error:", err);
    toast.error(err.response?.data?.msg || "Checkout failed");
  } finally {
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