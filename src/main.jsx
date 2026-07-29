import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import App from "./App";
import "./assets/styles/style.css";
import "./assets/styles/media.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { StepProvider } from "./context/StepContext";
import { saveToken } from "./services/api";

// Auto-login: read JWT from ?token param (WP iframe) or window.jrnyData
const _params = new URLSearchParams(window.location.search);
const _urlToken = _params.get('token');
if (_urlToken) saveToken(_urlToken);
else if (window.jrnyData?.token) saveToken(window.jrnyData.token);

// Read ?step param to restore route on WP page refresh
const _initialStep = _params.get('step');
const _initialPath = _initialStep ? '/' + _initialStep : null;

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
    <BrowserRouter initialEntries={_initialPath ? [_initialPath] : undefined}>
      <StepProvider><RouteReporter /><App /></StepProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

