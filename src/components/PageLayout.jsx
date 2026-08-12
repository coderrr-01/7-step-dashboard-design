import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const steps = [
  ["APPLY", "/"],
  ["REVIEW", "/review"],
  ["ROOM SEARCH", "/room-search"],
  ["INTERVIEW", "/interview"],
  ["SECURE BOOKING", "/secure-booking"],
  ["LEASE SIGN", "/document-sign"],
  ["SECURE PAYMENT", "/payment-screen"],
];

export default function PageLayout({ children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.body.className = `page-${pathname === "/" ? "index" : pathname.slice(1)}`;
    return () => { document.body.className = ""; };
  }, [pathname]);

   const activePath =
    pathname === "/view-room"
      ? "/room-search"
      : pathname === "/residence-agreement"
      ? "/document-sign"
      : pathname;

  const activeLabel =
    steps.find(([, path]) => path === activePath)?.[0] || "DASHBOARD";

  return <><Header activeLabel={activeLabel} />{children}<Footer /></>;
}
