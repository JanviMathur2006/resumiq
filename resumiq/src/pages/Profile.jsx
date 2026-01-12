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

/* ================= MODAL ================= */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-scaleIn">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  /* ================= MODAL STATES ================= */
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  /* ================= FORM STATES ================= */
  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

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

  const saveName = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await updateProfile(user, { displayName: name.trim() });
    setUser({ ...user, displayName: name.trim() });
    setEditName(false);
    setLoading(false);
  };

  const saveEmail = async () => {
    setError("");
    if (!newEmail || !emailPassword) {
      setError("All fields required");
      return;
    }

    try {
      setLoading(true);
      const cred = EmailAuthProvider.credential(
        user.email,
        emailPassword
      );
      await reauthenticateWithCredential(user, cred);
      await updateEmail(user, newEmail);
      setUser({ ...user, email: newEmail });
      setEditEmail(false);
    } catch {
      setError("Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    setError("");
    if (!currentPassword || !newPassword) {
      setError("All fields required");
      return;
    }

    try {
      setLoading(true);
      const cred = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setEditPassword(false);
    } catch {
      setError("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setError("");
    if (!deletePassword) {
      setError("Password required");
      return;
    }

    try {
      setLoading(true);
      const cred = EmailAuthProvider.credential(
        user.email,
        deletePassword
      );
      await reauthenticateWithCredential(user, cred);
      await deleteUser(user);
      navigate("/signup");
    } catch {
      setError("Incorrect password");
    } finally {
      setLoading(false);
    }
  };

  const sendVerify = async () => {
    await sendEmailVerification(user);
    setVerifyMsg("Verification email sent");
  };

  const logout = async () => {
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
            <p className="text-sm text-gray-600 flex gap-2">
              {user.email}
              {!user.emailVerified && (
                <span className="text-xs bg-gray-200 px-2 rounded-full">
                  Not verified
                </span>
              )}
            </p>
          </div>
        </div>

        {/* ACTION ROWS */}
        <div className="bg-white rounded-xl shadow-sm divide-y">
          <Row label="Full Name" value={user.displayName || "Not set"} action={() => setEditName(true)} />
          <Row label="Email" value={user.email} action={() => setEditEmail(true)} />
          <Row label="Password" value="••••••••" action={() => setEditPassword(true)} />
        </div>

        {/* EMAIL VERIFICATION */}
        {!user.emailVerified && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="font-medium text-red-600">Email not verified</p>
              {verifyMsg && <p className="text-sm text-gray-600">{verifyMsg}</p>}
            </div>
            <button
              onClick={sendVerify}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Send verification
            </button>
          </div>
        )}

        {/* DELETE + LOGOUT */}
        <div className="flex justify-between">
          <button
            onClick={() => setDeleteModal(true)}
            className="border border-red-400 text-red-600 px-4 py-2 rounded-lg"
          >
            Delete account
          </button>

          <button
            onClick={logout}
            className="bg-black text-white px-6 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

      </div>

      {/* ================= MODALS ================= */}

      {editName && (
        <Modal title="Edit name" onClose={() => setEditName(false)}>
          <input
            className="border rounded px-3 py-2 w-full mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <ModalActions onCancel={() => setEditName(false)} onSave={saveName} loading={loading} />
        </Modal>
      )}

      {editEmail && (
        <Modal title="Edit email" onClose={() => setEditEmail(false)}>
          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
          <input
            className="border rounded px-3 py-2 w-full mb-2"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Current password"
            className="border rounded px-3 py-2 w-full mb-4"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
          />
          <ModalActions onCancel={() => setEditEmail(false)} onSave={saveEmail} loading={loading} />
        </Modal>
      )}

      {editPassword && (
        <Modal title="Change password" onClose={() => setEditPassword(false)}>
          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
          <input
            type="password"
            placeholder="Current password"
            className="border rounded px-3 py-2 w-full mb-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            className="border rounded px-3 py-2 w-full mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <ModalActions onCancel={() => setEditPassword(false)} onSave={changePassword} loading={loading} />
        </Modal>
      )}

      {deleteModal && (
        <Modal title="Delete account" onClose={() => setDeleteModal(false)}>
          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
          <input
            type="password"
            placeholder="Current password"
            className="border rounded px-3 py-2 w-full mb-4"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
          <ModalActions
            danger
            onCancel={() => setDeleteModal(false)}
            onSave={deleteAccount}
            loading={loading}
          />
        </Modal>
      )}

    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Row({ label, value, action }) {
  return (
    <div className="p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
      <button
        onClick={action}
        className="border px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        Edit
      </button>
    </div>
  );
}

function ModalActions({ onCancel, onSave, loading, danger }) {
  return (
    <div className="flex justify-end gap-3">
      <button onClick={onCancel} className="px-4 py-2 rounded-lg border">
        Cancel
      </button>
      <button
        onClick={onSave}
        className={`px-4 py-2 rounded-lg text-white ${
          danger ? "bg-red-600" : "bg-black"
        }`}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
