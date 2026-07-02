import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function PageLayout({ children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.body.className = `page-${pathname === "/" ? "index" : pathname.slice(1)}`;
    return () => { document.body.className = ""; };
  }, [pathname]);
  return <><Header />{children}<Footer /></>;
}
