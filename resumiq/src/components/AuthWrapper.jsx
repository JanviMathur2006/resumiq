import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AuthWrapper() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("loggedIn") === "true";
    setIsLoggedIn(logged);
    setLoading(false);
  }, []);

  if (loading) return null;

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
}
