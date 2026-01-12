import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  /* ================= NAME ================= */
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  /* ================= EMAIL ================= */
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);

  /* ================= VERIFY ================= */
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  /* ================= PASSWORD ================= */
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  /* ================= DELETE ================= */
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  /* ================= ACTIONS ================= */

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setSavingName(true);
    await updateProfile(auth.currentUser, { displayName: name.trim() });
    setUser({ ...auth.currentUser, displayName: name.trim() });
    setEditingName(false);
    setSavingName(false);
  };

  const handleSaveEmail = async () => {
    setEmailError("");
    if (!newEmail || !emailPassword) {
      setEmailError("All fields are required");
      return;
    }

    try {
      setEmailSaving(true);
      const cred = EmailAuthProvider.credential(
        user.email,
        emailPassword
      );
      await reauthenticateWithCredential(user, cred);
      await updateEmail(user, newEmail);
      setUser({ ...user, email: newEmail });
      setEditingEmail(false);
      setEmailPassword("");
    } catch (e) {
      setEmailError("Failed to update email");
    } finally {
      setEmailSaving(false);
    }
  };

  const handleVerifyEmail = async () => {
    setVerifying(true);
    await sendEmailVerification(user);
    setVerifyMsg("Verification email sent");
    setVerifying(false);
  };

  const handleChangePassword = async () => {
    setPwdError("");
    if (!currentPassword || !newPassword) {
      setPwdError("All fields required");
      return;
    }

    try {
      setPwdLoading(true);
      const cred = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setShowPwdForm(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setPwdError("Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    if (!deletePassword) {
      setDeleteError("Password required");
      return;
    }

    try {
      setDeleting(true);
      const cred = EmailAuthProvider.credential(
        user.email,
        deletePassword
      );
      await reauthenticateWithCredential(user, cred);
      await deleteUser(user);
      navigate("/signup");
    } catch {
      setDeleteError("Incorrect password");
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-semibold">{name || "User"}</h1>
            <p className="text-sm text-gray-600 flex gap-2 items-center">
              {user.email}
              {!user.emailVerified && (
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  Not verified
                </span>
              )}
            </p>
          </div>
        </div>

        {/* NAME */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            {!editingName ? (
              <p className="font-medium">{user.displayName || "Not set"}</p>
            ) : (
              <input
                className="border rounded px-3 py-2 mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
          </div>
          <button
            onClick={editingName ? handleSaveName : () => setEditingName(true)}
            className="border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            {savingName ? "Saving..." : editingName ? "Save" : "Edit"}
          </button>
        </div>

        {/* EMAIL */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-2">Email</p>

          {!editingEmail ? (
            <div className="flex justify-between items-center">
              <p className="font-medium">{user.email}</p>
              <button
                onClick={() => setEditingEmail(true)}
                className="border px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
              <input
                className="border rounded px-3 py-2 w-full"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Current password"
                className="border rounded px-3 py-2 w-full"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
              />
              <button
                onClick={handleSaveEmail}
                className="border px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                {emailSaving ? "Saving..." : "Save Email"}
              </button>
            </div>
          )}
        </div>

        {/* EMAIL VERIFICATION */}
        {!user.emailVerified && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="font-medium text-red-600">
                Email not verified
              </p>
              {verifyMsg && (
                <p className="text-sm text-gray-600">{verifyMsg}</p>
              )}
            </div>
            <button
              onClick={handleVerifyEmail}
              disabled={verifying}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              {verifying ? "Sending..." : "Send verification"}
            </button>
          </div>
        )}

        {/* CHANGE PASSWORD */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-2">
          <p className="font-medium">Change Password</p>
          {!showPwdForm ? (
            <button
              onClick={() => setShowPwdForm(true)}
              className="text-blue-600 text-sm"
            >
              Change password
            </button>
          ) : (
            <>
              {pwdError && <p className="text-red-500 text-sm">{pwdError}</p>}
              <input
                type="password"
                placeholder="Current password"
                className="border rounded px-3 py-2 w-full"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New password"
                className="border rounded px-3 py-2 w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                onClick={handleChangePassword}
                className="border px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                {pwdLoading ? "Updating..." : "Update password"}
              </button>
            </>
          )}
        </div>

        {/* DELETE ACCOUNT */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
          <p className="font-medium text-red-600">Delete Account</p>

          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="border border-red-400 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
            >
              Delete account
            </button>
          ) : (
            <>
              {deleteError && (
                <p className="text-sm text-red-500">{deleteError}</p>
              )}
              <input
                type="password"
                placeholder="Current password"
                className="border rounded px-3 py-2 w-full"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                {deleting ? "Deleting..." : "Confirm delete"}
              </button>
            </>
          )}
        </div>

        {/* LOGOUT */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="bg-black text-white px-6 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
