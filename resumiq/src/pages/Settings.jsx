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
      <div className="space-y-8">

        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border">
          <h3 className="font-semibold mb-4">Theme Mode</h3>

          <div className="grid grid-cols-3 gap-3">
            {["system", "light", "dark"].map((item) => (
              <button
                key={item}
                onClick={() => setTheme(item)}
                className={`p-4 rounded-xl border transition-all capitalize ${
                  theme === item
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "hover:border-slate-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border">
          <h3 className="font-semibold mb-4">Layout Density</h3>

          <div className="grid grid-cols-2 gap-3">
            {["comfortable", "compact"].map((item) => (
              <button
                key={item}
                onClick={() => setDensity(item)}
                className={`p-4 rounded-xl border transition-all capitalize ${
                  density === item
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "hover:border-slate-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border">
          <h3 className="font-semibold mb-4">Preview</h3>

          <div className="rounded-xl border p-4 bg-white dark:bg-slate-900">
            <div className="h-3 w-40 bg-slate-300 rounded mb-3"></div>
            <div className="h-2 w-full bg-slate-200 rounded mb-2"></div>
            <div className="h-2 w-5/6 bg-slate-200 rounded mb-2"></div>
            <div className="h-2 w-4/6 bg-slate-200 rounded"></div>
          </div>
        </div>

      </div>
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

        <div className="border rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-2">
            Password Protection
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Keep your account secure with a strong password.
          </p>

          <button
  onClick={resetPassword}
  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
>
  Send Password Reset Email
</button>
        </div>

        <div className="border rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-2">
            Email Verification
          </h3>

          <p className="text-sm text-gray-500 mb-4">
            Verify your email address for additional account security.
          </p>

          {user?.emailVerified ? (
            <span className="text-green-600 font-medium">
              ✓ Verified
            </span>
          ) : (
            <button
              onClick={sendVerification}
              className="px-4 py-2 rounded-lg bg-green-600 text-white"
            >
              {sendingVerify ? "Sending..." : "Send Verification Email"}
            </button>
          )}
        </div>

        <div className="border rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-2">
            Login Information
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

        <div className="border rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-2 text-red-600">
            Security Recommendations
          </h3>

          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-600">
            <li>Use a strong password with at least 12 characters.</li>
            <li>Do not share your account credentials.</li>
            <li>Verify your email address.</li>
            <li>Regularly review your account activity.</li>
          </ul>
        </div>

      </div>
    </Section>
  );
     case "Terms":
  return (
    <Section title="Terms & Conditions">
      <Scrollable>

        <h3 className="font-semibold text-lg">1. Acceptance of Terms</h3>
        <p>
          By accessing and using Resumiq, you agree to comply with and be bound
          by these Terms & Conditions. If you do not agree with any part of
          these terms, you should discontinue use of the platform immediately.
        </p>

        <h3 className="font-semibold text-lg mt-5">2. User Accounts</h3>
        <p>
          Users are responsible for maintaining the confidentiality of their
          login credentials and for all activities conducted through their
          accounts.
        </p>

        <h3 className="font-semibold text-lg mt-5">3. Resume Ownership</h3>
        <p>
          You retain ownership of all resume content created on Resumiq. By
          using the service, you grant Resumiq permission to store and process
          your data solely to provide platform functionality.
        </p>

        <h3 className="font-semibold text-lg mt-5">4. Acceptable Use</h3>
        <p>
          Users may not upload harmful, fraudulent, unlawful, offensive, or
          misleading content. Violation of these rules may result in account
          suspension or termination.
        </p>

        <h3 className="font-semibold text-lg mt-5">5. Intellectual Property</h3>
        <p>
          All Resumiq branding, templates, software, features, and designs are
          protected by intellectual property laws and remain the property of
          Resumiq.
        </p>

        <h3 className="font-semibold text-lg mt-5">6. Privacy</h3>
        <p>
          Your use of Resumiq is also governed by our Privacy Policy. We take
          reasonable measures to safeguard your personal information.
        </p>

        <h3 className="font-semibold text-lg mt-5">7. Service Availability</h3>
        <p>
          We strive to maintain uninterrupted service but do not guarantee that
          the platform will always be available. Scheduled maintenance and
          technical issues may temporarily affect access.
        </p>

        <h3 className="font-semibold text-lg mt-5">8. Limitation of Liability</h3>
        <p>
          Resumiq shall not be liable for any indirect, incidental, special, or
          consequential damages arising from the use of the platform.
        </p>

        <h3 className="font-semibold text-lg mt-5">9. Account Termination</h3>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these Terms & Conditions or misuse the platform.
        </p>

        <h3 className="font-semibold text-lg mt-5">10. Changes to Terms</h3>
        <p>
          Resumiq may revise these Terms & Conditions at any time. Continued use
          of the platform after changes indicates acceptance of the updated
          terms.
        </p>

        <h3 className="font-semibold text-lg mt-5">11. Contact Information</h3>
        <p>
          If you have questions regarding these Terms & Conditions, please
          contact the Resumiq support team.
        </p>

      </Scrollable>
    </Section>
  );
      case "Privacy":
  return (
    <Section title="Privacy Policy">
      <Scrollable>
        <h3 className="font-semibold text-lg">1. Information We Collect</h3>
        <p>
          Resumiq may collect account information, resume data, preferences,
          and usage information required to provide platform services.
        </p>

        <h3 className="font-semibold text-lg mt-5">2. How We Use Data</h3>
        <p>
          Information is used to provide services, improve user experience,
          maintain platform security, and enhance resume-building features.
        </p>

        <h3 className="font-semibold text-lg mt-5">3. Data Protection</h3>
        <p>
          We implement reasonable security measures to protect user data from
          unauthorized access, disclosure, or misuse.
        </p>

        <h3 className="font-semibold text-lg mt-5">4. Third-Party Services</h3>
        <p>
          Certain features may rely on trusted third-party providers for
          authentication, analytics, storage, or communication services.
        </p>

        <h3 className="font-semibold text-lg mt-5">5. User Rights</h3>
        <p>
          Users may update, modify, export, or delete their information where
          supported by the platform.
        </p>

        <h3 className="font-semibold text-lg mt-5">6. Contact</h3>
        <p>
          Questions regarding privacy practices may be directed to the Resumiq
          support team.
        </p>
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
