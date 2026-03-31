// ================= BASE =================
export const API_BASE = "http://localhost:5000/api";
// export const API_BASE = "https://maanjufarmsbackend.onrender.com/api";

export const IMAGE_BASE = "http://localhost:5000/";
// export const IMAGE_BASE = "https://maanjufarmsbackend.onrender.com/";

// ================= AUTH =================
export const AUTH_API = `${API_BASE}/auth`;

// ================= E-COMMERCE =================
export const CART_API = `${API_BASE}/cart`;
export const PRODUCTS_API = `${API_BASE}/products`;

// ================= VILLAS / ROOMS =================
export const ROOMS_API = `${API_BASE}/rooms`;
export const BOOKINGS_API = `${API_BASE}/bookings`;

// ================= GALLERY =================
export const GALLERY_API = `${API_BASE}/gallery`;

// ================= PAYMENTS =================
const PAYMENTS_BASE = `${API_BASE}/payment`;

export const PAYMENT_ENDPOINTS = {
  PRODUCT_CHECKOUT: `${PAYMENTS_BASE}/product-checkout`,
  BOOKING_CHECKOUT: `${PAYMENTS_BASE}/booking-checkout`,
  VERIFY: `${PAYMENTS_BASE}/verify-session`,
};
