import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function AuthWrapper() {
  const [user, setUser] = useState(undefined); // 🔥 changed
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });

    return () => unsubscribe();
  }, []);

  // ⏳ While checking auth (IMPORTANT FIX)
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Checking authentication...
        </p>
      </div>
    );
  }

  // ❌ Not logged in → redirect
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }} // 🔥 safer
      />
    );
  }

  // ✅ Logged in → allow access
  return <Outlet />;
}