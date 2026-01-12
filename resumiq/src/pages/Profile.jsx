import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  // Load user safely
  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    setName(currentUser.displayName || "");
  }, [navigate]);

  // Save edited name
  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      setSaving(true);
      await updateProfile(auth.currentUser, {
        displayName: name.trim(),
      });

      // Refresh local user state
      setUser({
        ...auth.currentUser,
        displayName: name.trim(),
      });

      setEditing(false);
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
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

        {/* Name */}
        <div>
          <p className="text-sm text-gray-500">Full Name</p>

          {!editing ? (
            <p className="text-lg font-medium">
              {user.displayName || "Not set"}
            </p>
          ) : (
            <input
              className="border p-2 rounded w-full mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </div>

        {/* Email */}
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium">{user.email}</p>
        </div>

        {/* Joined */}
        <div>
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="text-lg font-medium">
            {new Date(user.metadata.creationTime).toDateString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white p-6 rounded-lg shadow flex gap-4">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => {
                setEditing(false);
                setName(user.displayName || "");
              }}
              className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </>
        )}
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
