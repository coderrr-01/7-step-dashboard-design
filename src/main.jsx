import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./assets/styles/style.css";
import "./assets/styles/media.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { StepProvider } from "./context/StepContext";
import { saveToken } from "./services/api";

// Auto-login: WP page injects window.jrnyData with JWT token
if (window.jrnyData?.token) {
  saveToken(window.jrnyData.token);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><BrowserRouter><StepProvider><App /></StepProvider></BrowserRouter></React.StrictMode>,
);

