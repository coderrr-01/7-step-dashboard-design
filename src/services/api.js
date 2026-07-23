// Central API service — all WordPress REST calls go through here

const WP_BASE = 'https://wordpress-1608288-6566160.cloudwaysapps.com/wp-json';
const JRNY    = `${WP_BASE}/jrny/v1`;
const LEASE   = `${WP_BASE}/lease-html-sign/v1`;

// ─── AUTH ─────────────────────────────────────────────────────────────────────
// Store credentials in localStorage after login
export function saveAuth(username, password) {
  const token = btoa(`${username}:${password}`);
  localStorage.setItem('jrny_auth', token);
}

export function getAuthHeader() {
  const token = localStorage.getItem('jrny_auth');
  if (!token) return {};
  return { Authorization: `Basic ${token}` };
}

export function isLoggedIn() {
  return !!localStorage.getItem('jrny_auth');
}

export function logout() {
  localStorage.removeItem('jrny_auth');
  localStorage.removeItem('jrny_nonce');
  localStorage.removeItem('jrny_client');
}

// ─── NONCE ────────────────────────────────────────────────────────────────────
async function getNonce() {
  const cached = localStorage.getItem('jrny_nonce');
  if (cached) return cached;

  const res  = await apiFetch(`${JRNY}/nonce`, { method: 'GET' });
  const data = await res.json();
  if (data.nonce) {
    localStorage.setItem('jrny_nonce', data.nonce);
    return data.nonce;
  }
  return '';
}

// ─── BASE FETCH ───────────────────────────────────────────────────────────────
async function apiFetch(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (res.status === 401) {
    logout();
    throw new Error('Session expired. Please log in again.');
  }

  return res;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export async function wpLogin(username, password) {
  saveAuth(username, password);

  // Verify credentials by hitting /client-data
  const res = await apiFetch(`${JRNY}/client-data`, { method: 'GET' });

  if (res.status === 401) {
    logout();
    return { success: false, message: 'Invalid username or password.' };
  }

  const data = await res.json();

  if (!data.success && res.status === 404) {
    // Credentials valid but no CRM record — still allow login
    return { success: true, data: null };
  }

  if (data.success) {
    localStorage.setItem('jrny_client', JSON.stringify(data.data));
    return { success: true, data: data.data };
  }

  logout();
  return { success: false, message: data.message || 'Login failed.' };
}

// ─── CLIENT DATA ──────────────────────────────────────────────────────────────
export async function getClientData() {
  const res  = await apiFetch(`${JRNY}/client-data`, { method: 'GET' });
  const data = await res.json();

  if (data.success) {
    localStorage.setItem('jrny_client', JSON.stringify(data.data));
  }

  return data;
}

// ─── STEP STATUS ──────────────────────────────────────────────────────────────
export async function getStepStatus() {
  const res  = await apiFetch(`${JRNY}/step-status`, { method: 'GET' });
  return res.json();
}

// ─── BOOK INTERVIEW ───────────────────────────────────────────────────────────
export async function bookInterview({ date, time, booking_type }) {
  const nonce = await getNonce();
  const res   = await apiFetch(`${JRNY}/book-interview`, {
    method:  'POST',
    headers: { 'X-WP-Nonce': nonce },
    body:    JSON.stringify({ date, time, booking_type }),
  });
  return res.json();
}

// ─── SECURE BOOKING ───────────────────────────────────────────────────────────
export async function secureBooking({ date, time, booking_type }) {
  const nonce = await getNonce();
  const res   = await apiFetch(`${JRNY}/secure-booking`, {
    method:  'POST',
    headers: { 'X-WP-Nonce': nonce },
    body:    JSON.stringify({ date, time, booking_type }),
  });
  return res.json();
}

// ─── SIGN LEASE (uses existing lease plugin endpoint directly) ────────────────
export async function signLease({ client_id, signature }) {
  const nonce = await getNonce();
  const res   = await apiFetch(`${LEASE}/create`, {
    method:  'POST',
    headers: { 'X-WP-Nonce': nonce },
    body:    JSON.stringify({ client_id, signature }),
  });
  return res.json();
}

// ─── ACH BANK PAYMENT ─────────────────────────────────────────────────────────
export async function submitAchPayment({ type, amount, txn_id, account_number }) {
  const nonce = await getNonce();
  const res   = await apiFetch(`${JRNY}/ach-payment`, {
    method:  'POST',
    headers: { 'X-WP-Nonce': nonce },
    body:    JSON.stringify({ type, amount, txn_id, account_number }),
  });
  return res.json();
}

// ─── CACHED CLIENT (sync, no network) ────────────────────────────────────────
export function getCachedClient() {
  try {
    const raw = localStorage.getItem('jrny_client');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
