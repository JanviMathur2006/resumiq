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

  /* ================= MODALS ================= */
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  /* ================= FORM STATE ================= */
  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    <div className="min-h-screen bg-gray-50">

      {/* COVER */}
      <div className="h-48 bg-gradient-to-r from-blue-200 to-indigo-200" />

      <div className="max-w-6xl mx-auto px-6 -mt-20">
        <div className="flex gap-8">

          {/* LEFT SIDEBAR */}
          <aside className="w-72 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-semibold text-indigo-600">
                {name.slice(0, 2).toUpperCase()}
              </div>
              <h2 className="mt-4 font-semibold text-lg">{name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>

              <button className="mt-4 px-4 py-2 border rounded-lg w-full hover:bg-gray-100">
                Manage your account
              </button>
            </div>

            {/* ABOUT */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6 space-y-3">
              <p className="text-xs font-semibold text-gray-500">ABOUT</p>
              <InfoRow label="Job title" value="—" />
              <InfoRow label="Department" value="—" />
              <InfoRow label="Organization" value="Resumiq" />
              <InfoRow label="Location" value="India" />
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="flex-1 space-y-6">

            {/* ACTIONS */}
            <div className="bg-white rounded-xl shadow-sm divide-y">
              <ActionRow label="Full name" value={name || "Not set"} onEdit={() => setEditName(true)} />
              <ActionRow label="Email" value={user.email} onEdit={() => setEditEmail(true)} />
              <ActionRow label="Password" value="••••••••" onEdit={() => setEditPassword(true)} />
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

            {/* FOOTER ACTIONS */}
            <div className="flex justify-between">
              <button
                onClick={() => setDeleteModal(true)}
                className="border border-red-400 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
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
          </main>
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
          <ModalActions danger onCancel={() => setDeleteModal(false)} onSave={deleteAccount} loading={loading} />
        </Modal>
      )}
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function ActionRow({ label, value, onEdit }) {
  return (
    <div className="p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
      <button
        onClick={onEdit}
        className="border px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        Edit
      </button>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
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
