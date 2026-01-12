import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Get current user safely
  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <p className="text-gray-500 mt-1">
          Manage your personal information
        </p>
      </div>

      {/* Profile Info */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="text-lg font-medium">
            {user.displayName || "Not set"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="text-lg font-medium">
            {new Date(user.metadata.creationTime).toDateString()}
          </p>
        </div>
      </div>

      {/* Logout – LAST */}
      <div className="bg-white p-6 rounded-lg shadow flex justify-end">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

    </div>
  );
}
