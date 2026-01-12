import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signOut,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Profile() {
  const navigate = useNavigate();

  // -------- User state --------
  const [user, setUser] = useState(null);

  // -------- Edit profile (name) --------
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // -------- Change password --------
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  // -------- Load user safely --------
  useEffect(() => {
    const u = auth.currentUser;
    if (!u) {
      navigate("/login");
      return;
    }
    setUser(u);
    setName(u.displayName || "");
  }, [navigate]);

  // -------- Save name --------
  const handleSaveName = async () => {
    if (!name.trim()) return;
    try {
      setSavingName(true);
      await updateProfile(auth.currentUser, { displayName: name.trim() });
      // refresh local snapshot
      setUser({ ...auth.currentUser, displayName: name.trim() });
      setEditing(false);
    } catch (e) {
      console.error("Update name failed:", e);
    } finally {
      setSavingName(false);
    }
  };

  // -------- Change password --------
  const handleChangePassword = async () => {
    setPwdError("");
    setPwdSuccess("");

    if (!currentPassword || !newPassword) {
      setPwdError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setPwdError("New password must be at least 6 characters");
      return;
    }

    try {
      setPwdLoading(true);
      const u = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        u.email,
        currentPassword
      );

      // Re-authenticate (required by Firebase)
      await reauthenticateWithCredential(u, credential);

      // Update password
      await updatePassword(u, newPassword);

      setPwdSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setShowPwdForm(false);
    } catch (e) {
      if (e.code === "auth/wrong-password") {
        setPwdError("Current password is incorrect");
      } else {
        setPwdError("Failed to change password");
      }
    } finally {
      setPwdLoading(false);
    }
  };

  // -------- Logout --------
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile…
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

        {/* Member Since */}
        <div>
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="text-lg font-medium">
            {new Date(user.metadata.creationTime).toDateString()}
          </p>
        </div>
      </div>

      {/* Edit Profile Actions */}
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
              onClick={handleSaveName}
              disabled={savingName}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              {savingName ? "Saving…" : "Save"}
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

      {/* Change Password */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>

        {!showPwdForm ? (
          <button
            onClick={() => setShowPwdForm(true)}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Change Password
          </button>
        ) : (
          <>
            {pwdError && <p className="text-red-500 text-sm">{pwdError}</p>}
            {pwdSuccess && (
              <p className="text-green-600 text-sm">{pwdSuccess}</p>
            )}

            <input
              type="password"
              placeholder="Current password"
              className="w-full border p-2 rounded"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New password"
              className="w-full border p-2 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={handleChangePassword}
                disabled={pwdLoading}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                {pwdLoading ? "Updating…" : "Update Password"}
              </button>
              <button
                onClick={() => {
                  setShowPwdForm(false);
                  setPwdError("");
                  setPwdSuccess("");
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* Logout (LAST) */}
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
