import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Palette,
  FileText,
  Bell,
  Lock,
  AlertTriangle,
} from "lucide-react";
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";
import PageTransition from "../components/PageTransition";

/* ================= TAB ANIMATION ================= */
const tabVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

export default function Settings() {
  /* ================= AUTH ================= */
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  /* ================= ACCOUNT ================= */
  const [name, setName] = useState("");
  const [editingName, setEditingName] = useState(false);

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  /* ================= EMAIL VERIFY ================= */
  const [sendingVerify, setSendingVerify] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  /* ================= UI ================= */
  const [activeTab, setActiveTab] = useState("Account");

  /* ================= APPEARANCE ================= */
  const [themeMode, setThemeMode] = useState("system");
  const [density, setDensity] = useState("comfortable");
  const [accent, setAccent] = useState("blue");

  /* ================= RESUME PREFS ================= */
  const [paperSize, setPaperSize] = useState("A4");
  const [autoSave, setAutoSave] = useState(true);
  const [dragDrop, setDragDrop] = useState(true);
  const [resumeStrength, setResumeStrength] = useState(true);

  /* ================= NOTIFICATIONS ================= */
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);

  /* ================= AUTH EFFECT ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setName(currentUser?.displayName || "");
      setLoadingUser(false);
    });
    return () => unsub();
  }, []);

  /* ================= SAVE NAME ================= */
  const handleSaveName = async () => {
    if (!name.trim()) return;
    await updateProfile(user, { displayName: name.trim() });
    setEditingName(false);
  };

  /* ================= CHANGE EMAIL ================= */
  const handleChangeEmail = async () => {
    if (!newEmail || !currentPassword) {
      setEmailMessage("All fields required");
      return;
    }

    try {
      setEmailLoading(true);
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
    } catch {
      setEmailMessage("Failed to update email");
    } finally {
      setEmailLoading(false);
    }
  };

  /* ================= SEND VERIFICATION ================= */
  const handleSendVerification = async () => {
    try {
      setSendingVerify(true);
      await sendEmailVerification(user);
      setVerifyMsg("Verification email sent. Check your inbox.");
    } catch {
      setVerifyMsg("Failed to send verification email.");
    } finally {
      setSendingVerify(false);
    }
  };

  /* ================= DELETE ACCOUNT ================= */
  const handleDeleteAccount = async () => {
    if (!confirm("This will permanently delete your account. Continue?")) return;
    await deleteUser(user);
  };

  /* ================= SIDEBAR ================= */
  const tabs = [
    { key: "Account", label: "Account", icon: User },
    { key: "Appearance", label: "Appearance", icon: Palette },
    { key: "Resume", label: "Resume Preferences", icon: FileText },
    { key: "Notifications", label: "Notifications", icon: Bell },
    { key: "Security", label: "Security", icon: Lock },
    { key: "Delete", label: "Delete Account", icon: AlertTriangle, danger: true },
  ];

  /* ================= CONTENT ================= */
  const renderContent = () => {
    if (loadingUser) return null;

    switch (activeTab) {
      case "Account":
        return (
          <Section title="Account">
            {!user.emailVerified && (
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  Your email is not verified.
                </p>
                <button
                  onClick={handleSendVerification}
                  disabled={sendingVerify}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
                >
                  {sendingVerify ? "Sending..." : "Send verification"}
                </button>
              </div>
            )}

            {verifyMsg && (
              <p className="text-sm text-gray-600">{verifyMsg}</p>
            )}

            <Input label="Name" value={name} disabled={!editingName} onChange={setName} />

            {!editingName ? (
              <Action onClick={() => setEditingName(true)}>Edit Name</Action>
            ) : (
              <Action onClick={handleSaveName}>Save Name</Action>
            )}

            <Input label="Email" value={user.email} disabled />

            {!editingEmail ? (
              <Action onClick={() => setEditingEmail(true)}>Edit Email</Action>
            ) : (
              <>
                <Input label="New Email" value={newEmail} onChange={setNewEmail} />
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                />
                <Action onClick={handleChangeEmail}>
                  {emailLoading ? "Saving..." : "Save Email"}
                </Action>
                {emailMessage && (
                  <p className="text-sm text-gray-600">{emailMessage}</p>
                )}
              </>
            )}
          </Section>
        );

      case "Appearance":
        return (
          <Section title="Appearance">
            <Select
              label="Theme"
              value={themeMode}
              onChange={setThemeMode}
              options={[
                { label: "System", value: "system" },
                { label: "Light", value: "light" },
                { label: "Dark", value: "dark" },
              ]}
            />

            <Select
              label="UI Density"
              value={density}
              onChange={setDensity}
              options={[
                { label: "Comfortable", value: "comfortable" },
                { label: "Compact", value: "compact" },
              ]}
            />

            <Toggle label="Accent: Blue" value={accent === "blue"} onChange={() => setAccent("blue")} />
            <Toggle label="Accent: Purple" value={accent === "purple"} onChange={() => setAccent("purple")} />
            <Toggle label="Accent: Green" value={accent === "green"} onChange={() => setAccent("green")} />
          </Section>
        );

      case "Resume":
        return (
          <Section title="Resume Preferences">
            <Select
              label="Paper Size"
              value={paperSize}
              onChange={setPaperSize}
              options={[
                { label: "A4 (Recommended)", value: "A4" },
                { label: "US Letter", value: "US" },
              ]}
            />
            <Toggle label="Auto-save resumes" value={autoSave} onChange={setAutoSave} />
            <Toggle label="Drag & drop sections" value={dragDrop} onChange={setDragDrop} />
            <Toggle label="Resume strength indicator" value={resumeStrength} onChange={setResumeStrength} />
          </Section>
        );

      case "Notifications":
        return (
          <Section title="Notifications">
            <Toggle label="Email notifications" value={emailNotifications} onChange={setEmailNotifications} />
            <Toggle label="Product updates" value={productUpdates} onChange={setProductUpdates} />
          </Section>
        );

      case "Security":
        return (
          <Section title="Security">
            <p className="text-sm text-gray-600">
              Password and security settings can be added here.
            </p>
          </Section>
        );

      case "Delete":
        return (
          <Section title="Delete Account">
            <p className="text-sm text-gray-600 mb-4">
              This action is permanent and cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Account
            </button>
          </Section>
        );

      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 dark:bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
          <aside className="w-64 bg-[#0F172A] rounded-xl p-3 text-white">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded ${
                  t.danger ? "text-red-400" : ""
                }`}
              >
                <t.icon size={18} />
                {t.label}
              </button>
            ))}
          </aside>

          <main className="flex-1 bg-white dark:bg-[#0F172A] rounded-xl p-8">
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

/* ================= REUSABLE COMPONENTS ================= */
function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-6">{title}</h2>
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

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm">{label}</span>
      <input type="checkbox" checked={value} onChange={() => onChange(!value)} />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-800"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Action({ children, onClick }) {
  return (
    <button onClick={onClick} className="text-blue-600 text-sm">
      {children}
    </button>
  );
}
