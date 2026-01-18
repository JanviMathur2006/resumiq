import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Palette,
  Bell,
  FileText,
  AlertTriangle,
} from "lucide-react";
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { auth } from "../firebase";
import PageTransition from "../components/PageTransition";

/* =====================================================
   TAB ANIMATION
===================================================== */
const tabVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

export default function Settings() {
  /* ---------------- AUTH ---------------- */
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  /* ---------------- NAME ---------------- */
  const [name, setName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [savingName, setSavingName] = useState(false);

  /* ---------------- EMAIL ---------------- */
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  /* ---------------- UI ---------------- */
  const [activeTab, setActiveTab] = useState("Account");
  const [collapsed, setCollapsed] = useState(false);

  /* ---------------- THEME ---------------- */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /* ---------------- AUTH EFFECT ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setName(currentUser?.displayName || "");
      setLoadingUser(false);
    });
    return () => unsub();
  }, []);

  /* ---------------- THEME EFFECT ---------------- */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ---------------- SAVE NAME ---------------- */
  const handleSaveName = async () => {
    if (!user || !name.trim()) return;
    try {
      setSavingName(true);
      await updateProfile(user, { displayName: name.trim() });
      setEditingName(false);
    } catch {
      alert("Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  /* ---------------- CHANGE EMAIL ---------------- */
  const handleChangeEmail = async () => {
    if (!user || !newEmail || !currentPassword) {
      setEmailMessage("All fields are required");
      return;
    }

    try {
      setEmailLoading(true);
      setEmailMessage("");

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);

      setEmailMessage("Email updated successfully");
      setEditingEmail(false);
      setNewEmail("");
      setCurrentPassword("");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setEmailMessage("Incorrect password");
      } else if (err.code === "auth/email-already-in-use") {
        setEmailMessage("Email already in use");
      } else {
        setEmailMessage("Failed to update email");
      }
    } finally {
      setEmailLoading(false);
    }
  };

  /* ---------------- DELETE ACCOUNT ---------------- */
  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!confirm("This will permanently delete your account. Continue?")) return;

    try {
      await deleteUser(user);
      alert("Account deleted");
    } catch {
      alert("Please re-login before deleting your account");
    }
  };

  /* ---------------- SIDEBAR ---------------- */
  const tabs = [
    { key: "Account", label: "Account", icon: User },
    { key: "Appearance", label: "Appearance", icon: Palette },
    { key: "Resume", label: "Resume Preferences", icon: FileText },
    { key: "Notifications", label: "Notifications", icon: Bell },
    { key: "Security", label: "Security", icon: Lock },
    { key: "Danger", label: "Danger Zone", icon: AlertTriangle, danger: true },
  ];

  /* =====================================================
     TAB CONTENT
  ===================================================== */
  const renderContent = () => {
    if (loadingUser) return <p>Loading…</p>;

    switch (activeTab) {
      case "Account":
        return (
          <Section title="Account">
            {/* NAME */}
            <Input
              label="Name"
              value={name}
              onChange={setName}
              disabled={!editingName}
            />

            {!editingName ? (
              <button
                onClick={() => setEditingName(true)}
                className="text-blue-600 text-sm"
              >
                Edit Name
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSaveName}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  {savingName ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setName(user.displayName || "");
                    setEditingName(false);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* EMAIL */}
            <Input label="Email" value={user.email} disabled />

            {!editingEmail ? (
              <button
                onClick={() => setEditingEmail(true)}
                className="text-blue-600 text-sm"
              >
                Edit Email
              </button>
            ) : (
              <div className="space-y-3">
                <Input
                  label="New Email"
                  value={newEmail}
                  onChange={setNewEmail}
                />
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleChangeEmail}
                    disabled={emailLoading}
                    className="px-4 py-2 bg-black text-white rounded"
                  >
                    {emailLoading ? "Updating..." : "Save Email"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingEmail(false);
                      setNewEmail("");
                      setCurrentPassword("");
                      setEmailMessage("");
                    }}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                </div>

                {emailMessage && (
                  <p className="text-sm text-gray-600">{emailMessage}</p>
                )}
              </div>
            )}
          </Section>
        );

      case "Security":
        return (
          <Section title="Security">
            <p className="text-sm text-gray-500">
              Password and sensitive account settings.
            </p>
          </Section>
        );

      case "Danger":
        return (
          <Section title="Danger Zone" danger>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Account
            </button>
          </Section>
        );

      default:
        return <Section title={activeTab}>Coming soon</Section>;
    }
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 dark:bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">

          {/* SIDEBAR */}
          <motion.aside
            animate={{ width: collapsed ? 80 : 256 }}
            className="bg-[#0F172A] text-slate-300 rounded-2xl p-3"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex gap-3 px-3 py-2 rounded ${
                    tab.danger ? "text-red-400" : ""
                  }`}
                >
                  <Icon size={20} />
                  {!collapsed && tab.label}
                </button>
              );
            })}
          </motion.aside>

          {/* CONTENT */}
          <main className="flex-1 bg-white dark:bg-[#0F172A] rounded-2xl p-8">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} {...tabVariants}>
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </PageTransition>
  );
}

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */
function Section({ title, children, danger }) {
  return (
    <section>
      <h2 className={`text-lg font-semibold mb-6 ${danger ? "text-red-600" : ""}`}>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({ label, value, onChange, type = "text", disabled }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-800"
      />
    </div>
  );
}
