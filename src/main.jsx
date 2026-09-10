import React from "react";
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
const _params = new URLSearchParams(window.location.search);
const _urlToken = _params.get('token');
const _candidateToken = _urlToken || window.jrnyData?.token;
if (_candidateToken && _candidateToken !== getLoggedOutToken()) {
  saveToken(_candidateToken);
  clearLoggedOutToken();
}

// Notify WP parent of route changes
function RouteReporter() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    const slug = pathname === '/' ? 'apply' : pathname.replace(/^\//, '');
    window.parent.postMessage({ type: 'jrny_route', slug }, '*');
  }, [pathname]);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <StepProvider><RouteReporter /><App /></StepProvider>
    </MemoryRouter>
  </React.StrictMode>,
);
