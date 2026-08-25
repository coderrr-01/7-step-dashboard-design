// All WordPress REST calls — JWT Bearer token auth

const WP_BASE = 'https://wordpress-1608288-6566160.cloudwaysapps.com/wp-json';
const JRNY    = `${WP_BASE}/jrny/v1`;
const LEASE   = `${WP_BASE}/lease-html-sign/v1`;

const TOKEN_KEY  = 'jrny_jwt';
const NONCE_KEY  = 'jrny_nonce';
const LOGOUT_TOKEN_KEY = 'jrny_logout_token';

// JS-accessible session-ish cookie names this app may own. HttpOnly WordPress
// auth cookies cannot be cleared here — they are invalidated server-side by
// the real WP logout (see the jrny_logout handler in the WP dashboard template).
const SESSION_COOKIE_NAMES = new Set(['token', 'jwt', 'auth', 'session', 'PHPSESSID', 'wordpress_test_cookie']);

function clientKey() {
  const sub = getUserSub();
  return sub ? `jrny_client_${sub}` : 'jrny_client';
}

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

// Session-scoped marker for the exact token the user explicitly logged out of.
// Used by main.jsx to ignore a stale ?token / window.jrnyData on the reload
// that follows logout, while still allowing a fresh token to auto-login.
export function getLoggedOutToken() {
  try {
    return sessionStorage.getItem(LOGOUT_TOKEN_KEY) || null;
  } catch { return null; }
}

export function clearLoggedOutToken() {
  try { sessionStorage.removeItem(LOGOUT_TOKEN_KEY); } catch {}
}

// ─── USER SUB ─────────────────────────────────────────────────────────────────
export function getUserSub() {
  try {
    const token = getToken();
    if (!token) return null;
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return payload.sub ? String(payload.sub) : null;
  } catch { return null; }
}

// Best-effort removal of any JS-accessible session cookies the app may own.
// Only the app's own namespace (jrny_*) or known session names are removed —
// unrelated cookies are never touched.
function clearSessionCookies() {
  try {
    document.cookie.split(';').forEach(c => {
      const name = (c.split('=')[0] || '').trim();
      if (!name) return;
      if (name.indexOf('jrny_') === 0 || SESSION_COOKIE_NAMES.has(name)) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
    });
  } catch {}
}

export function logout() {
  // Remember the token being explicitly logged out so a stale ?token or
  // window.jrnyData cannot silently restore the session on the next reload.
  const token = getToken();
  if (token) {
    try { sessionStorage.setItem(LOGOUT_TOKEN_KEY, token); } catch {}
  }

  clearSessionCookies();

  // Clear all jrny_ keys EXCEPT the user-scoped steps key and the last-visited
  // route so the same user gets their progress back instantly — and resumes on
  // the exact screen they logged out from (main.jsx resumeInitialEntry).
  const sub = getUserSub();
  const keepKeys = [
    sub ? `jrny_completed_steps_${sub}` : null,
    'jrny_last_route',
  ].filter(Boolean);
  Object.keys(localStorage)
    .filter(k => k.startsWith('jrny_') && !keepKeys.includes(k))
    .forEach(k => localStorage.removeItem(k));
}

// Invalidates the WordPress server-side authentication session (the HttpOnly
// wordpress_logged_in_* cookie). Best-effort: the caller redirects IMMEDIATELY
// (to preserve iOS Safari user-activation for the cross-origin top-navigation)
// while this call keeps running in the background — keepalive:true lets it
// survive that navigation so WordPress still gets told to kill the session.
export async function wpServerLogout(token) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 10000) : null;
  try {
    await fetch(`${JRNY}/logout`, {
      method: 'POST',
      credentials: 'include',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(controller ? { signal: controller.signal } : {}),
    });
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// ─── BASE FETCH ───────────────────────────────────────────────────────────────
export async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // Default to sending cookies (credentials: 'include'), but allow a caller to
  // override — e.g. 'omit' for Bearer-authenticated cross-site GETs. iOS Safari
  // (WebKit ITP) blocks a cross-site fetch that carries credentials, which shows
  // up as "Load failed"; those calls authenticate via the Bearer JWT header, so
  // omitting cookies lets them succeed on iPhone without weakening auth.
  const credentials = options.credentials || 'include';
  // iOS Safari (WebKit ITP) blocks cross-site fetches carrying credentials —
  // they die in-browser with "Load failed" without ever reaching the server,
  // so retrying without credentials cannot double-submit anything. Android /
  // desktop succeed on the first attempt exactly as before; on iPhone the
  // retry below lets the Bearer JWT carry authentication instead of cookies.
  let res;
  try {
    res = await fetch(url, { ...options, credentials, headers });
  } catch (networkErr) {
    if (credentials !== 'include') throw new Error('Network request failed');
    res = await fetch(url, { ...options, credentials: 'omit', headers });
  }

  if (res.status === 401) {
    logout();
    const loginUrl = (window.jrnyData?.loginUrl) || 'https://wordpress-1608288-6566160.cloudwaysapps.com/login';
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'jrny_logout', loginUrl }, '*');
    } else {
      window.location.href = loginUrl;
    }
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
    localStorage.setItem(clientKey(), JSON.stringify(data.client_data));
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
  const res  = await apiFetch(`${JRNY}/nonce?_=${Date.now()}`, { method: 'GET' });
  const data = await res.json();
  if (data.nonce) {
    localStorage.setItem(NONCE_KEY, data.nonce);
    return data.nonce;
  }
  return '';
}

// ─── CLIENT DATA ──────────────────────────────────────────────────────────────
export async function getClientData() {
  // Cache-bust via a unique URL param instead of `cache: 'no-store'` — the
  // latter can make fetch() hang indefinitely on iOS Safari/WebKit (with
  // credentials), which left the app stuck on "Loading Application" on iPhone.
  const res  = await apiFetch(`${JRNY}/client-data?_=${Date.now()}`, { method: 'GET', credentials: 'omit' });
  const data = await res.json();
  if (data.success) localStorage.setItem(clientKey(), JSON.stringify(data.data));
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
  // Same treatment as getClientData(): iOS Safari (ITP) blocks the
  // credentials-carrying cross-site fetch ("Load failed"). fetchStatus()
  // swallows that error silently, so approval from Zoho was never detected on
  // iPhone and the Verification Complete screen never appeared (Android was
  // unaffected). The Bearer JWT authenticates the call, so cookies can be
  // omitted safely; cache-bust the GET so every poll reaches the server.
  const res = await apiFetch(`${JRNY}/application-status?_=${Date.now()}`, { method: 'GET', credentials: 'omit' });
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

// ─── RELEASE SLOT (used by Reschedule) ────────────────────────────────────────
// Frees a previously booked date/time so it becomes selectable again. Does not
// touch Google Meet / CRM — booking a new slot handles those idempotently.
export async function releaseSlot({ date, time }) {
  const nonce = await getNonce();
  const res   = await apiFetch(`${JRNY}/release-slot`, {
    method: 'POST', headers: { 'X-WP-Nonce': nonce },
    body: JSON.stringify({ date, time }),
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

export async function createRevolutCheckout(type) {
  const res = await apiFetch(`${JRNY}/revolut-checkout`, {
    method: 'POST',
    body: JSON.stringify({ type }),
  });
  return res.json();
}

export async function getRevolutStatus(type) {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  params.set('_', String(Date.now())); // cache-bust via URL (see getClientData note)
  const res = await apiFetch(`${JRNY}/revolut-status?${params.toString()}`, {
    method: 'GET',
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
    const raw = localStorage.getItem(clientKey());
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── LAST ROUTE (server-side, cross-device) ──────────────────────────────────
export async function saveLastRoute(path) {
  const sub = getUserSub();
  if (!sub || !path) return;
  try {
    await fetch(`${JRNY}/last-route`, {
      method: 'POST',
      credentials: 'include',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
      body: JSON.stringify({ sub, path }),
    });
  } catch { /* best-effort */ }
}

export async function getLastRoute() {
  try {
    const res = await apiFetch(`${JRNY}/last-route?_=${Date.now()}`, { method: 'GET' });
    const data = await res.json();
    if (data.success && data.path) return data.path;
  } catch { /* fall through to localStorage */ }
  return null;
}

// ─── PAYMENT UI (iframe HTML from WP shortcodes) ─────────────────────────────
export async function getPaymentUI(method, section) {
  const params = new URLSearchParams({ method, section, _: String(Date.now()) });
  const res = await apiFetch(`${JRNY}/payment-ui?${params.toString()}`, { method: 'GET' });
  return res.json();
}
