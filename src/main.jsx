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
import { StepProvider } from "./context/StepContext";
import { saveToken, getLoggedOutToken, clearLoggedOutToken } from "./services/api";

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
const _initialEntry = _step ? '/' + _step : '/';

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

// Notify WP parent of route changes so it can update the browser URL
function RouteReporter() {
  const { pathname } = useLocation();
  useEffect(() => {
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
