import { useEffect, useState } from "react";
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
   SETTINGS PAGE – FULL IMPLEMENTATION
   ===================================================== */

export default function Settings() {
  /* ---------------- THEME ---------------- */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /* ---------------- SIDEBAR ---------------- */
  const [activeTab, setActiveTab] = useState("Account");

  /* ---------------- SETTINGS STATES ---------------- */
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

  /* =====================================================
     SIDEBAR ITEMS
     ===================================================== */
  const tabs = [
    { key: "Account", label: "Account", icon: User },
    { key: "Appearance", label: "Appearance", icon: Palette },
    { key: "Resume", label: "Resume Preferences", icon: FileText },
    { key: "Notifications", label: "Notifications", icon: Bell },
    { key: "Security", label: "Security", icon: Lock },
    { key: "Danger", label: "Danger Zone", icon: AlertTriangle, danger: true },
  ];

  /* =====================================================
     CONTENT RENDER
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
            <Toggle
              label="Dark Mode"
              value={darkMode}
              onChange={setDarkMode}
            />

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
            <Toggle label="Show resume strength indicator" value={resumeStrength} onChange={setResumeStrength} />
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
          <aside className="w-64 bg-[#0F172A] text-slate-300 rounded-2xl p-5">
            <h1 className="text-white text-lg font-semibold mb-6">
              Settings
            </h1>

            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition
                      ${
                        active
                          ? "bg-white text-black"
                          : tab.danger
                          ? "text-red-400 hover:bg-red-500/10"
                          : "hover:bg-white/10"
                      }
                    `}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ================= CONTENT ================= */}
          <main className="flex-1">
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-8 shadow-sm">
              {renderContent()}
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
      <input
        type="checkbox"
        checked={value}
        onChange={() => onChange(!value)}
      />
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
