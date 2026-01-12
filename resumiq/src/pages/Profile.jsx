import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
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
  const [pwdError, setPwdError] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  /* ================= DELETE ACCOUNT ================= */
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

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
      await updateProfile(auth.currentUser, { displayName: name.trim() });
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

      await reauthenticateWithCredential(u, credential);
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

      setShowPwdForm(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      setPwdError("Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  };

  /* ================= DELETE ACCOUNT ================= */
  const handleDeleteAccount = async () => {
    setDeleteError("");

    if (!deletePassword) {
      setDeleteError("Password is required");
      return;
    }

    try {
      setDeleting(true);
      const u = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        u.email,
        deletePassword
      );

      await reauthenticateWithCredential(u, credential);
      await deleteUser(u);

      navigate("/signup");
    } catch (e) {
      if (e.code === "auth/wrong-password") {
        setDeleteError("Incorrect password");
      } else {
        setDeleteError("Failed to delete account");
      }
    } finally {
      setDeleting(false);
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
        <p className="text-gray-500">Manage your account</p>
      </div>

      {/* NAME */}
      <div className="bg-white p-6 rounded shadow space-y-2">
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
          <button onClick={() => setEditingName(true)} className="text-blue-600 text-sm">
            Edit Name
          </button>
        ) : (
          <button onClick={handleSaveName} className="text-blue-600 text-sm">
            {savingName ? "Saving..." : "Save"}
          </button>
        )}
      </div>

      {/* EMAIL */}
      <div className="bg-white p-6 rounded shadow space-y-2">
        <p className="text-sm text-gray-500">Email</p>
        {!editingEmail ? (
          <p className="text-lg">{user.email}</p>
        ) : (
          <>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            <input
              className="border p-2 rounded w-full"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current password"
              className="border p-2 rounded w-full"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
            />
          </>
        )}

        {!editingEmail ? (
          <button onClick={() => setEditingEmail(true)} className="text-blue-600 text-sm">
            Edit Email
          </button>
        ) : (
          <button onClick={handleSaveEmail} className="text-blue-600 text-sm">
            {emailSaving ? "Saving..." : "Save Email"}
          </button>
        )}
      </div>

      {/* CHANGE PASSWORD */}
      <div className="bg-white p-6 rounded shadow space-y-2">
        <h2 className="font-semibold">Change Password</h2>

        {!showPwdForm ? (
          <button onClick={() => setShowPwdForm(true)} className="text-blue-600 text-sm">
            Change Password
          </button>
        ) : (
          <>
            {pwdError && <p className="text-red-500 text-sm">{pwdError}</p>}
            <input
              type="password"
              placeholder="Current password"
              className="border p-2 rounded w-full"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              className="border p-2 rounded w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword} className="text-blue-600 text-sm">
              {pwdLoading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}
      </div>

      {/* DELETE ACCOUNT */}
      <div className="bg-white p-6 rounded shadow border border-red-200 space-y-3">
        <h2 className="font-semibold text-red-600">Delete Account</h2>
        <p className="text-sm text-gray-600">
          This action is permanent and cannot be undone.
        </p>

        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            className="border border-red-500 text-red-600 px-4 py-2 rounded"
          >
            Delete Account
          </button>
        ) : (
          <>
            {deleteError && <p className="text-red-500 text-sm">{deleteError}</p>}
            <input
              type="password"
              placeholder="Enter current password"
              className="border p-2 rounded w-full"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </>
        )}
      </div>

      {/* LOGOUT */}
      <div className="bg-white p-6 rounded shadow flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Logout
        </button>
      </div>

    </div>
  );
}
