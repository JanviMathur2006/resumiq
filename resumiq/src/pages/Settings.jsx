import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Palette,
  FileText,
  Bell,
  Lock,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  sendEmailVerification,
  sendPasswordResetEmail,
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
  const resetPassword = async () => {
  try {
    await sendPasswordResetEmail(auth, user.email);
    alert("Password reset email sent successfully.");
  } catch (error) {
    alert(error.message);
  }
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
    { key: "Help", label: "Help & Support", icon: HelpCircle },
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
      <div className="space-y-6">

        <div className="bg-slate-50 dark:bg-slate-800/50 border rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-2">
            Password Protection
          </h3>
          <p className="text-gray-600 mb-4">
            Keep your account secure by using a strong password.
          </p>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={resetPassword}
          >
            Send Password Reset Email
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 border rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-2">
            Email Verification
          </h3>

          <p className="text-gray-600 mb-4">
            Verify your email address for enhanced account security.
          </p>

          {user?.emailVerified ? (
            <span className="text-green-600 font-medium">
              ✓ Email Verified
            </span>
          ) : (
            <button
              onClick={sendVerification}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              {sendingVerify
                ? "Sending..."
                : "Send Verification Email"}
            </button>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 border rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-2">
            Account Information
          </h3>

          <div className="space-y-2 text-sm">
            <p>
              <strong>Email:</strong> {user?.email}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {user?.emailVerified
                ? "Verified"
                : "Not Verified"}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 border rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-2 text-red-600">
            Security Tips
          </h3>

          <ul className="list-disc ml-5 text-sm text-gray-600 space-y-2">
            <li>Use a password with at least 12 characters.</li>
            <li>Do not share your credentials.</li>
            <li>Verify your email address.</li>
            <li>Regularly review account activity.</li>
          </ul>
        </div>

      </div>
    </Section>
  );
     case "Terms":
  return (
    <Section title="Terms & Conditions">
      <div className="bg-slate-50 dark:bg-slate-800/50 border rounded-xl p-6 space-y-6">

        <div>
          <h3 className="font-semibold text-lg mb-2">
            1. Acceptance of Terms
          </h3>
          <p className="text-gray-600">
            By using Resumiq, you agree to comply with these terms and conditions.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            2. Account Responsibility
          </h3>
          <p className="text-gray-600">
            You are responsible for maintaining the security of your account and credentials.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            3. Resume Ownership
          </h3>
          <p className="text-gray-600">
            You retain ownership of all resume content created on Resumiq.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            4. Acceptable Use
          </h3>
          <p className="text-gray-600">
            Users must not upload harmful, illegal, misleading, or offensive content.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            5. Service Availability
          </h3>
          <p className="text-gray-600">
            We strive for uninterrupted service but cannot guarantee 100% uptime.
          </p>
        </div>

      </div>
    </Section>
  );

      case "Privacy":
  return (
    <Section title="Privacy Policy">
      <div className="bg-slate-50 dark:bg-slate-800/50 border rounded-xl p-6 space-y-6">

        <div>
          <h3 className="font-semibold text-lg mb-2">
            1. Information We Collect
          </h3>
          <p className="text-gray-600">
            We collect account information, resume data, preferences, and usage
            information necessary to provide our services.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            2. How We Use Your Data
          </h3>
          <p className="text-gray-600">
            Your information is used to improve platform functionality,
            personalize your experience, and maintain security.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            3. Data Security
          </h3>
          <p className="text-gray-600">
            We implement industry-standard security measures to protect your
            information from unauthorized access.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            4. Third-Party Services
          </h3>
          <p className="text-gray-600">
            Some services may rely on trusted third-party providers for
            authentication, analytics, and storage.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            5. User Rights
          </h3>
          <p className="text-gray-600">
            You can update, export, or delete your account information at any
            time through your settings.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            6. Contact Us
          </h3>
          <p className="text-gray-600">
            If you have questions regarding our privacy practices, please
            contact the Resumiq support team.
          </p>
        </div>

      </div>
    </Section>
  );
  case "Help":
  return (
    <Section title="Help & Support">
      <div className="bg-slate-50 dark:bg-slate-800/50 border rounded-xl p-6 space-y-6">

        <div>
          <h3 className="font-semibold text-lg mb-2">
            Contact Support
          </h3>

          <p className="text-gray-600">
            If you experience any bugs, technical issues, account problems,
            or have suggestions for improving ResumiQ, please contact us.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            Email Support
          </h3>

          <p className="text-blue-600 font-medium">
            mathurj9900@gmail.com
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            Response Time
          </h3>

          <p className="text-gray-600">
            We typically respond within 24–48 hours.
          </p>
        </div>

      </div>
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
          <aside className="w-64 bg-[#0F172A] dark:bg-[#020617] rounded-xl p-3 text-white">
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
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={() => onChange(!value)}
        className="w-4 h-4"
      />
      <span>{label}</span>
    </label>
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
