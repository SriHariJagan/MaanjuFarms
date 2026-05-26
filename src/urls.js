// ================= BASE =================

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

export const IMAGE_BASE =
  import.meta.env.VITE_IMAGE_BASE_URL ||
  "http://localhost:5000/";


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


// ================= CONTACT =================
export const CONTACT_API = `${API_BASE}/contact`;


// ================= PAYMENTS =================
const PAYMENTS_BASE = `${API_BASE}/payment`;

export const PAYMENT_ENDPOINTS = {
  PRODUCT_CHECKOUT: `${PAYMENTS_BASE}/product-order`,
  BOOKING_CHECKOUT: `${PAYMENTS_BASE}/booking-order`,
  VERIFY: `${PAYMENTS_BASE}/verify-payment`,
  PAYMENT_FAILED: `${PAYMENTS_BASE}/payment-failed`,
};


// ================= PINCODE =================

export const PINCODE_API = `${API_BASE}/pincode`;
export const PINCODE_ENDPOINTS = {
  CHECK: (pin) =>
    `${PINCODE_API}/check/${pin}`,
  BLOCKED: `${PINCODE_API}/blocked`,
  DELETE: (id) =>
    `${PINCODE_API}/blocked/${id}`,
};