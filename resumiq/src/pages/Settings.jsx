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
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
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

  /* ================= EMAIL VERIFY ================= */
  const [sendingVerify, setSendingVerify] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  /* ================= APPEARANCE ================= */
  const [theme, setTheme] = useState("system");
  const [density, setDensity] = useState("comfortable");

  /* ================= RESUME ================= */
  const [autoSave, setAutoSave] = useState(true);
  const [dragDrop, setDragDrop] = useState(true);

  /* ================= NOTIFICATIONS ================= */
  const [emailNotif, setEmailNotif] = useState(true);
  const [productNotif, setProductNotif] = useState(false);

  /* ================= UI ================= */
  const [activeTab, setActiveTab] = useState("Account");

  /* ================= AUTH EFFECT ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setName(u?.displayName || "");
      setLoadingUser(false);
    });
    return () => unsub();
  }, []);

  /* ================= HANDLERS ================= */
  const saveName = async () => {
    await updateProfile(user, { displayName: name });
    setEditingName(false);
  };

  const changeEmail = async () => {
    try {
      const cred = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, cred);
      await updateEmail(user, newEmail);
      setEmailMessage("Email updated");
      setEditingEmail(false);
    } catch {
      setEmailMessage("Failed to update email");
    }
  };

  const sendVerification = async () => {
    setSendingVerify(true);
    await sendEmailVerification(user);
    setVerifyMsg("Verification email sent");
    setSendingVerify(false);
  };

  const deleteAccount = async () => {
    if (!confirm("Delete account permanently?")) return;
    await deleteUser(user);
  };

  /* ================= TABS ================= */
  const tabs = [
    { key: "Account", label: "Account", icon: User },
    { key: "Appearance", label: "Appearance", icon: Palette },
    { key: "Resume", label: "Resume Preferences", icon: FileText },
    { key: "Notifications", label: "Notifications", icon: Bell },
    { key: "Security", label: "Security", icon: Lock },
    { key: "Terms", label: "Terms & Conditions", icon: FileText },
    { key: "Privacy", label: "Privacy Policy", icon: Lock },
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
              <Banner>
                <span>Email not verified</span>
                <button onClick={sendVerification}>
                  {sendingVerify ? "Sending..." : "Send verification"}
                </button>
              </Banner>
            )}
            {verifyMsg && <p className="text-sm">{verifyMsg}</p>}

            <Input label="Name" value={name} disabled={!editingName} onChange={setName} />
            {!editingName ? (
              <Action onClick={() => setEditingName(true)}>Edit</Action>
            ) : (
              <Action onClick={saveName}>Save</Action>
            )}

            <Input label="Email" value={user.email} disabled />
            {!editingEmail ? (
              <Action onClick={() => setEditingEmail(true)}>Edit Email</Action>
            ) : (
              <>
                <Input label="New Email" value={newEmail} onChange={setNewEmail} />
                <Input
                  label="Password"
                  type="password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                />
                <Action onClick={changeEmail}>Save Email</Action>
                {emailMessage && <p className="text-sm">{emailMessage}</p>}
              </>
            )}
          </Section>
        );

      case "Appearance":
        return (
          <Section title="Appearance">
            <Select
              label="Theme"
              value={theme}
              onChange={setTheme}
              options={[
                { label: "System", value: "system" },
                { label: "Light", value: "light" },
                { label: "Dark", value: "dark" },
              ]}
            />
            <Select
              label="Density"
              value={density}
              onChange={setDensity}
              options={[
                { label: "Comfortable", value: "comfortable" },
                { label: "Compact", value: "compact" },
              ]}
            />
          </Section>
        );

      case "Resume":
        return (
          <Section title="Resume Preferences">
            <Toggle label="Auto-save resumes" value={autoSave} onChange={setAutoSave} />
            <Toggle label="Drag & drop sections" value={dragDrop} onChange={setDragDrop} />
          </Section>
        );

      case "Notifications":
        return (
          <Section title="Notifications">
            <Toggle label="Email notifications" value={emailNotif} onChange={setEmailNotif} />
            <Toggle label="Product updates" value={productNotif} onChange={setProductNotif} />
          </Section>
        );

      case "Security":
        return (
          <Section title="Security">
            <p className="text-sm">Security options can be added here.</p>
          </Section>
        );

      case "Terms":
        return (
          <Section title="Terms & Conditions">
            <Scrollable>
              <p>Using Resumiq means you agree to these terms.</p>
              <p>You are responsible for your account and data.</p>
              <p>We may suspend accounts violating policies.</p>
            </Scrollable>
          </Section>
        );

      case "Privacy":
        return (
          <Section title="Privacy Policy">
            <Scrollable>
              <p>Your data is stored securely.</p>
              <p>We do not sell your information.</p>
              <p>You may delete your account anytime.</p>
            </Scrollable>
          </Section>
        );

      case "Delete":
        return (
          <Section title="Delete Account">
            <button onClick={deleteAccount} className="bg-red-600 text-white px-4 py-2 rounded">
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

/* ================= REUSABLE ================= */
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
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
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
        className="w-full border p-2 rounded"
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

function Banner({ children }) {
  return (
    <div className="flex justify-between items-center border p-3 rounded bg-gray-50">
      {children}
    </div>
  );
}

function Scrollable({ children }) {
  return (
    <div className="max-h-[400px] overflow-y-auto text-sm space-y-3">
      {children}
    </div>
  );
}
