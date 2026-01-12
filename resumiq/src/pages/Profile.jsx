import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signOut,
  updateProfile,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Profile() {
  const navigate = useNavigate();

  /* ================= USER ================= */
  const [user, setUser] = useState(null);

  /* ================= EDIT NAME ================= */
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  /* ================= EDIT EMAIL ================= */
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);

  /* ================= CHANGE PASSWORD ================= */
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const u = auth.currentUser;
    if (!u) {
      navigate("/login");
      return;
    }
    setUser(u);
    setName(u.displayName || "");
    setNewEmail(u.email || "");
  }, [navigate]);

  /* ================= SAVE NAME ================= */
  const handleSaveName = async () => {
    if (!name.trim()) return;
    try {
      setSavingName(true);
      await updateProfile(auth.currentUser, {
        displayName: name.trim(),
      });
      setUser({ ...auth.currentUser, displayName: name.trim() });
      setEditingName(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingName(false);
    }
  };

  /* ================= SAVE EMAIL ================= */
  const handleSaveEmail = async () => {
    setEmailError("");

    if (!newEmail || !emailPassword) {
      setEmailError("All fields are required");
      return;
    }

    try {
      setEmailSaving(true);

      const u = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        u.email,
        emailPassword
      );

      // 🔐 Re-authenticate
      await reauthenticateWithCredential(u, credential);

      // ✉️ Update email
      await updateEmail(u, newEmail);

      setUser({ ...u, email: newEmail });
      setEditingEmail(false);
      setEmailPassword("");
    } catch (e) {
      if (e.code === "auth/wrong-password") {
        setEmailError("Incorrect password");
      } else if (e.code === "auth/email-already-in-use") {
        setEmailError("Email already in use");
      } else {
        setEmailError("Failed to update email");
      }
    } finally {
      setEmailSaving(false);
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const handleChangePassword = async () => {
    setPwdError("");
    setPwdSuccess("");

    if (!currentPassword || !newPassword) {
      setPwdError("All fields are required");
      return;
    }

    try {
      setPwdLoading(true);
      const u = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        u.email,
        currentPassword
      );

      await reauthenticateWithCredential(u, credential);
      await updatePassword(u, newPassword);

      setPwdSuccess("Password updated successfully");
      setShowPwdForm(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      setPwdError("Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
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

      {/* HEADER */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <p className="text-gray-500">Manage your account details</p>
      </div>

      {/* NAME */}
      <div className="bg-white p-6 rounded shadow space-y-3">
        <p className="text-sm text-gray-500">Full Name</p>
        {!editingName ? (
          <p className="text-lg">{user.displayName || "Not set"}</p>
        ) : (
          <input
            className="border p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {!editingName ? (
          <button
            onClick={() => setEditingName(true)}
            className="text-blue-600 text-sm"
          >
            Edit Name
          </button>
        ) : (
          <button
            onClick={handleSaveName}
            className="text-blue-600 text-sm"
          >
            {savingName ? "Saving..." : "Save"}
          </button>
        )}
      </div>

      {/* EMAIL */}
      <div className="bg-white p-6 rounded shadow space-y-3">
        <p className="text-sm text-gray-500">Email</p>

        {!editingEmail ? (
          <p className="text-lg">{user.email}</p>
        ) : (
          <>
            {emailError && (
              <p className="text-red-500 text-sm">{emailError}</p>
            )}

            <input
              type="email"
              className="border p-2 rounded w-full"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <input
              type="password"
              className="border p-2 rounded w-full"
              placeholder="Current password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
            />
          </>
        )}

        {!editingEmail ? (
          <button
            onClick={() => setEditingEmail(true)}
            className="text-blue-600 text-sm"
          >
            Edit Email
          </button>
        ) : (
          <button
            onClick={handleSaveEmail}
            className="text-blue-600 text-sm"
          >
            {emailSaving ? "Saving..." : "Save Email"}
          </button>
        )}
      </div>

      {/* CHANGE PASSWORD */}
      <div className="bg-white p-6 rounded shadow space-y-3">
        <h2 className="font-semibold">Change Password</h2>

        {!showPwdForm ? (
          <button
            onClick={() => setShowPwdForm(true)}
            className="text-blue-600 text-sm"
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
              className="border p-2 rounded w-full"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              className="border p-2 rounded w-full"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={handleChangePassword}
              className="text-blue-600 text-sm"
            >
              {pwdLoading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}
      </div>

      {/* LOGOUT */}
      <div className="bg-white p-6 rounded shadow flex justify-end">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded"
        >
          Logout
        </button>
      </div>

    </div>
  );
}
