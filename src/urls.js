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

const PRODUCTS_BASE = `${API_BASE}/products`;

export const PRODUCTS_API = PRODUCTS_BASE;
export const PRODUCTS_ENDPOINTS = {
  ALL: PRODUCTS_BASE,
  ADD: PRODUCTS_BASE,
  UPDATE: (id) => `${PRODUCTS_BASE}/${id}`,
  DELETE: (id) => `${PRODUCTS_BASE}/${id}`,
};


// ================= VILLAS / ROOMS =================
export const ROOMS_API = `${API_BASE}/rooms`;
export const ROOMS_ENDPOINTS = {
  ALL: ROOMS_API,
  DETAILS: (id) => `${ROOMS_API}/${id}`,
  AVAILABILITY: (id) => `${ROOMS_API}/${id}/availability`,
  ADD: ROOMS_API,
  UPDATE: (id) => `${ROOMS_API}/${id}`,
  DELETE: (id) => `${ROOMS_API}/${id}`,
};
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


// ================= ORDERS =================

const ORDERS_BASE = `${API_BASE}/orders`;

export const ORDERS_API = {
  ALL: `${ORDERS_BASE}/all`,
  MY_ORDERS: `${ORDERS_BASE}/my-orders`,
  DETAILS: (id) => `${ORDERS_BASE}/${id}`,
  UPDATE_STATUS: (id) => `${ORDERS_BASE}/${id}/status`,
  UPDATE_DELIVERY: (id) => `${ORDERS_BASE}/${id}/delivery`,
  CANCEL: (id) => `${ORDERS_BASE}/${id}/cancel`,
  RESEND_EMAIL: (id) => `${ORDERS_BASE}/${id}/resend-email`,
  STATS: `${ORDERS_BASE}/stats/dashboard`,
  INVOICE: (id) => `${ORDERS_BASE}/${id}/invoice`,
};


// ================= USERS =================

const USERS_BASE = `${API_BASE}/users`;

export const USERS_API = {
  ALL: `${USERS_BASE}/all`,
  DETAILS: (id) => `${USERS_BASE}/${id}`,
  UPDATE: (id) => `${USERS_BASE}/${id}`,
};


// ================= PINCODE =================

export const PINCODE_API = `${API_BASE}/pincode`;
export const PINCODE_ENDPOINTS = {
  CHECK: (pin) =>
    `${PINCODE_API}/check/${pin}`,
  BLOCKED: `${PINCODE_API}/blocked`,
  ADD: `${PINCODE_API}/blocked`,
  DELETE: (id) =>
    `${PINCODE_API}/blocked/${id}`,
};

// ================= POLICIES =================

const POLICIES_BASE = `${API_BASE}/policies`;

export const POLICY_API = {
  ALL: POLICIES_BASE,
  BY_SLUG: (slug) => `${POLICIES_BASE}/${slug}`,
};

export const ADMIN_POLICY_API = `${API_BASE}/admin/policies`;