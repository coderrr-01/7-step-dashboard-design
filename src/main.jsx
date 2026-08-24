import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { MemoryRouter, useLocation } from "react-router-dom";
import App from "./App";
import "./assets/styles/style.css";
import "./assets/styles/media.css";
import "./assets/styles/typeform.css";
import "./assets/styles/modern.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { StepProvider, STEP_PATHS } from "./context/StepContext";
import { saveToken, getLoggedOutToken, clearLoggedOutToken, getUserSub } from "./services/api";

// Auto-login: read JWT from ?token param (WP iframe) or window.jrnyData.
// This MUST run before StepProvider mounts so stepsKey() finds the token
// and reads the correct user-scoped localStorage key on first render.
// The exact token the user explicitly logged out of (see api.js logout) is
// ignored so a stale session cannot be restored by ?token / window.jrnyData
// on the reload that follows logout. A fresh/different token still auto-logins.
const _params = new URLSearchParams(window.location.search);
const _urlToken = _params.get('token');
const _candidateToken = _urlToken || window.jrnyData?.token;
if (_candidateToken && _candidateToken !== getLoggedOutToken()) {
  saveToken(_candidateToken);
  clearLoggedOutToken();
}

// Read ?step param passed by WP shortcode on refresh e.g. ?step=room-search
const _step = _params.get('step');

// Last route the user was on (saved by RouteReporter on every navigation).
// Tagged with the user sub so a different user logging in on the same browser
// never resumes into someone else's screen.
const _lastRoute = (() => {
  try {
    const raw = JSON.parse(localStorage.getItem('jrny_last_route') || 'null');
    return raw && typeof raw.path === 'string' ? raw : null;
  } catch { return null; }
})();

// Resume the user's correct step on login. Priority order:
// 1. The exact screen the user was on when they logged out (jrny_last_route,
//    matched against the logged-in user's sub). This must WIN over WP's
//    ?step param: WordPress remembers an older slug and would otherwise land
//    the user on the wrong screen after re-login (e.g. Review instead of the
//    page they logged out from).
// 2. An explicit ?step slug from WP (mid-session refresh deep-links to a real
//    step; 'apply' is the dashboard root WordPress sends on a fresh login).
//    Only consulted when no personal last-route exists (fresh browser/cache).
// 3. Derived from the same user-scoped completed-steps progress the navigator
//    uses, which persists across logout.
// 4. Home/Apply (Step 1) for brand-new users with no progress.
function resumeInitialEntry() {
  if (_lastRoute && _lastRoute.sub === (getUserSub() || '') && _lastRoute.path.length > 1) {
    return _lastRoute.path;
  }
  if (_step && _step !== 'apply') return '/' + _step;
  try {
    const sub = getUserSub();
    const key = sub ? `jrny_completed_steps_${sub}` : 'jrny_completed_steps';
    const completed = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(completed) || completed.length === 0) return '/';
    let cur = 1;
    while (cur < 7 && completed.includes(cur)) cur++;
    return STEP_PATHS[cur] || '/';
  } catch {
    return '/';
  }
}
const _initialEntry = resumeInitialEntry();

// When running inside an iframe, ensure the viewport meta is set correctly
// so CSS media queries fire based on the device width, not the iframe container
(function ensureViewportMeta() {
  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'viewport';
    document.head.appendChild(meta);
  }
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
})();

// Notify WP parent of route changes so it can update the browser URL, and
// remember the last visited screen so logout→login resumes exactly there.
function RouteReporter() {
  const { pathname } = useLocation();
  useEffect(() => {
    try {
      localStorage.setItem('jrny_last_route', JSON.stringify({ sub: getUserSub() || '', path: pathname }));
    } catch {}
    const slug = pathname === '/' ? 'apply' : pathname.replace(/^\//, '');
    window.parent.postMessage({ type: 'jrny_route', slug }, '*');
  }, [pathname]);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MemoryRouter initialEntries={[_initialEntry]} initialIndex={0}>
      <StepProvider><RouteReporter /><App /></StepProvider>
    </MemoryRouter>
  </React.StrictMode>,
);
