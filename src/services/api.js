// All WordPress REST calls — JWT Bearer token auth

const WP_BASE = 'https://wordpress-1608288-6566160.cloudwaysapps.com/wp-json';
const JRNY    = `${WP_BASE}/jrny/v1`;
const LEASE   = `${WP_BASE}/lease-html-sign/v1`;

const TOKEN_KEY  = 'jrny_jwt';
const CLIENT_KEY = 'jrny_client';
const NONCE_KEY  = 'jrny_nonce';

// ─── TOKEN ────────────────────────────────────────────────────────────────────
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  try {
    // Decode JWT payload (part 2) and check exp
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CLIENT_KEY);
  localStorage.removeItem(NONCE_KEY);
  localStorage.removeItem('jrny_signed_lease');
}

// ─── BASE FETCH ───────────────────────────────────────────────────────────────
async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, credentials: 'include', headers });

  if (res.status === 401) {
    logout();
    throw new Error('Session expired. Please log in again.');
  }
  return res;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export async function wpLogin(username, password) {
  logout(); // clear any stale token first

  const res = await fetch(`${JRNY}/login`, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return { success: false, message: data.message || 'Login failed.' };
  }

  saveToken(data.token);

  if (data.client_data) {
    localStorage.setItem(CLIENT_KEY, JSON.stringify(data.client_data));
  }

  return { success: true, token: data.token, user: data.user, client_data: data.client_data };
}

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
export async function refreshToken() {
  const res  = await apiFetch(`${JRNY}/refresh-token`, { method: 'GET' });
  const data = await res.json();
  if (data.success && data.token) {
    saveToken(data.token);
    return data.token;
  }
  return null;
}

// ─── NONCE ────────────────────────────────────────────────────────────────────
export async function getNonce() {
  const cached = localStorage.getItem(NONCE_KEY);
  if (cached) return cached;
  const res  = await apiFetch(`${JRNY}/nonce`, { method: 'GET' });
  const data = await res.json();
  if (data.nonce) {
    localStorage.setItem(NONCE_KEY, data.nonce);
    return data.nonce;
  }
  return '';
}

// ─── CLIENT DATA ──────────────────────────────────────────────────────────────
export async function getClientData() {
  const res  = await apiFetch(`${JRNY}/client-data`, { method: 'GET' });
  const data = await res.json();
  if (data.success) localStorage.setItem(CLIENT_KEY, JSON.stringify(data.data));
  return data;
}

// ─── STEP STATUS ──────────────────────────────────────────────────────────────
export async function getStepStatus() {
  const res = await apiFetch(`${JRNY}/step-status`, { method: 'GET' });
  return res.json();
}

// ─── ROOMS ───────────────────────────────────────────────────────────────────
export async function getRooms() {
  const res = await fetch(`${JRNY}/rooms`, { method: 'GET', credentials: 'include' });
  return res.json();
}

// ─── APPLY FORM ──────────────────────────────────────────────────────────────
export async function applyForm(data) {
  const res = await fetch(`${JRNY}/apply`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ─── APPLICATION STATUS ───────────────────────────────────────────────────────
export async function getApplicationStatus() {
  const res = await apiFetch(`${JRNY}/application-status`, { method: 'GET' });
  return res.json();
}

// ─── BOOK INTERVIEW ───────────────────────────────────────────────────────────
export async function bookInterview({ date, time, booking_type, room_id, room_name, client_id }) {
  const nonce = await getNonce();
  const res   = await apiFetch(`${JRNY}/book-interview`, {
    method: 'POST', headers: { 'X-WP-Nonce': nonce },
    body: JSON.stringify({ date, time, booking_type, room_id, room_name, client_id }),
  });
  return res.json();
}

// ─── SECURE BOOKING ───────────────────────────────────────────────────────────
export async function secureBooking({ date, time, booking_type, client_id }) {
  const nonce = await getNonce();
  const res   = await apiFetch(`${JRNY}/secure-booking`, {
    method: 'POST', headers: { 'X-WP-Nonce': nonce },
    body: JSON.stringify({ date, time, booking_type, client_id }),
  });
  return res.json();
}

// ─── SIGN LEASE ───────────────────────────────────────────────────────────────
export async function signLease({ client_id, signature }) {
  const nonce = await getNonce();
  const res   = await apiFetch(`${LEASE}/create`, {
    method: 'POST', headers: { 'X-WP-Nonce': nonce },
    body: JSON.stringify({ client_id, signature }),
  });
  return res.json();
}

// ─── STRIPE PAYMENT ──────────────────────────────────────────────────────────
export async function submitStripePayment({ type, client_id, amount, txn_id }) {
  const nonce = await getNonce();
  const route = type === 'deposit' ? 'stripe-deposit' : 'stripe-rent';
  const res   = await apiFetch(`${JRNY}/${route}`, {
    method: 'POST', headers: { 'X-WP-Nonce': nonce },
    body: JSON.stringify({ client_id, amount, txn_id }),
  });
  return res.json();
}

// ─── PAYPAL PAYMENT ───────────────────────────────────────────────────────────
export async function submitPaypalPayment({ type, client_id, amount }) {
  const nonce = await getNonce();
  const route = type === 'deposit' ? 'paypal-deposit' : 'paypal-rent';
  const res   = await apiFetch(`${JRNY}/${route}`, {
    method: 'POST', headers: { 'X-WP-Nonce': nonce },
    body: JSON.stringify({ client_id, amount }),
  });
  return res.json();
}

// ─── REVOLUT PAYMENT ──────────────────────────────────────────────────────────
export async function submitRevolutPayment({ type, client_id, amount }) {
  const nonce = await getNonce();
  const res   = await apiFetch(`${JRNY}/revolut-payment`, {
    method: 'POST', headers: { 'X-WP-Nonce': nonce },
    body: JSON.stringify({ type, client_id, amount }),
  });
  return res.json();
}

// ─── ACH PAYMENT ─────────────────────────────────────────────────────────────
export async function submitAchPayment({ type, amount, txn_id, account_number }) {
  const nonce = await getNonce();
  const res   = await apiFetch(`${JRNY}/ach-payment`, {
    method: 'POST', headers: { 'X-WP-Nonce': nonce },
    body: JSON.stringify({ type, amount, txn_id, account_number }),
  });
  return res.json();
}

// ─── EXTENSION REQUEST ──────────────────────────────────────────────────────
export async function requestLeaseExtension({ client_id, start_date, end_date, comment }) {
  const nonce = await getNonce();
  const res   = await apiFetch(`${JRNY}/extension-request`, {
    method: 'POST', headers: { 'X-WP-Nonce': nonce },
    body: JSON.stringify({ client_id, start_date, end_date, comment }),
  });
  return res.json();
}

// ─── CACHED CLIENT ────────────────────────────────────────────────────────────
export function getCachedClient() {
  try {
    const raw = localStorage.getItem(CLIENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── PAYMENT UI (iframe HTML from WP shortcodes) ─────────────────────────────
export async function getPaymentUI(method, section) {
  const res = await apiFetch(`${JRNY}/payment-ui?method=${encodeURIComponent(method)}&section=${encodeURIComponent(section)}`, { method: 'GET' });
  return res.json();
}
