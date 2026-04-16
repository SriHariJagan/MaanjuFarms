// ================= BASE =================
export const API_BASE = import.meta.env.VITE_API_BASE;
export const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE;

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
  PRODUCT_CHECKOUT: `${PAYMENTS_BASE}/product-order`,
  BOOKING_CHECKOUT: `${PAYMENTS_BASE}/booking-order`,
  VERIFY: `${PAYMENTS_BASE}/verify-payment`,
};
