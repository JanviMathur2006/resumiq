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
import PageTransition from "../components/PageTransition";

/* =====================================================
   TAB ANIMATION
===================================================== */
const tabVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

/* =====================================================
   SETTINGS PAGE
===================================================== */
export default function Settings() {
  /* ---------------- UI STATE ---------------- */
  const [activeTab, setActiveTab] = useState("Account");
  const [collapsed, setCollapsed] = useState(false);

  /* ---------------- THEME ---------------- */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /* ---------------- SETTINGS ---------------- */
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [dragDrop, setDragDrop] = useState(true);
  const [resumeStrength, setResumeStrength] = useState(true);
  const [autoScrollWeak, setAutoScrollWeak] = useState(false);
  const [atsWarnings, setAtsWarnings] = useState(false);
  const [paperSize, setPaperSize] = useState("A4");
  const [editorView, setEditorView] = useState("comfortable");

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

  /* ---------------- SIDEBAR ITEMS ---------------- */
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
    switch (activeTab) {
      case "Account":
        return (
          <Section title="Account">
            <Input label="Name" value="John Doe" disabled />
            <Input label="Email" value="john@example.com" disabled />
            <button className="text-blue-600 text-sm hover:underline">
              Change Password
            </button>
          </Section>
        );

      case "Appearance":
        return (
          <Section title="Appearance">
            <Toggle label="Dark Mode" value={darkMode} onChange={setDarkMode} />
            <Select
              label="Editor View"
              value={editorView}
              onChange={setEditorView}
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
            <Select
              label="Paper Size"
              value={paperSize}
              onChange={setPaperSize}
              options={[
                { label: "A4 (Recommended)", value: "A4" },
                { label: "US Letter", value: "US" },
              ]}
            />
            <Toggle label="Auto-save while editing" value={autoSave} onChange={setAutoSave} />
            <Toggle label="Enable section drag & drop" value={dragDrop} onChange={setDragDrop} />
            <Toggle label="Resume strength indicator" value={resumeStrength} onChange={setResumeStrength} />
            <Toggle label="Auto-scroll to weak sections" value={autoScrollWeak} onChange={setAutoScrollWeak} />
            <Toggle label="ATS keyword warnings" value={atsWarnings} onChange={setAtsWarnings} />
          </Section>
        );

      case "Notifications":
        return (
          <Section title="Notifications">
            <Toggle
              label="Email notifications"
              value={emailNotifications}
              onChange={setEmailNotifications}
            />
          </Section>
        );

      case "Security":
        return (
          <Section title="Security">
            <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800">
              Change Password
            </button>
          </Section>
        );

      case "Danger":
        return (
          <Section title="Danger Zone" danger>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Delete Account
            </button>
          </Section>
        );

      default:
        return null;
    }
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 dark:bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">

          {/* ================= SIDEBAR ================= */}
          <motion.aside
            animate={{ width: collapsed ? 80 : 256 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0F172A] text-slate-300 rounded-2xl p-3 flex flex-col"
          >
            {/* TOP */}
            <div className="flex items-center justify-between px-2 mb-6">
              {!collapsed && (
                <span className="text-white font-semibold text-lg">
                  Settings
                </span>
              )}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-slate-400 hover:text-white"
              >
                {collapsed ? "➡" : "≡"}
              </button>
            </div>

            {/* NAV */}
            <nav className="space-y-1 flex-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
                      ${
                        active
                          ? "bg-white text-black"
                          : tab.danger
                          ? "text-red-400 hover:bg-red-500/10"
                          : "hover:bg-white/10"
                      }
                    `}
                  >
                    <Icon size={20} />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                        >
                          {tab.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {collapsed && (
                      <span className="absolute left-full ml-3 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none">
                        {tab.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </motion.aside>

          {/* ================= CONTENT ================= */}
          <main className="flex-1">
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-8 shadow-sm overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
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
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <input type="checkbox" checked={value} onChange={() => onChange(!value)} />
    </div>
  );
}

function Input({ label, value, disabled }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        value={value}
        disabled={disabled}
        className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-800"
      />
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
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
