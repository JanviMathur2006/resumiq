import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";

export default function Settings() {
  /* ------------------ STATE ------------------ */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [dragDrop, setDragDrop] = useState(true);
  const [resumeStrength, setResumeStrength] = useState(true);
  const [autoScrollWeak, setAutoScrollWeak] = useState(false);
  const [atsWarnings, setAtsWarnings] = useState(false);

  const [paperSize, setPaperSize] = useState("A4");
  const [editorView, setEditorView] = useState("comfortable");

  /* ------------------ THEME EFFECT ------------------ */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ------------------ UI ------------------ */
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-xl shadow-sm">

        <h1 className="text-2xl font-semibold mb-8">Settings</h1>

        {/* ================= ACCOUNT ================= */}
        <section className="mb-10">
          <h2 className="text-lg font-medium mb-4">Account</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">
                Name
              </label>
              <input
                type="text"
                value="John Doe"
                disabled
                className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">
                Email
              </label>
              <input
                type="email"
                value="john@example.com"
                disabled
                className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <button className="text-blue-600 hover:underline w-fit">
              Change Password
            </button>
          </div>
        </section>

        {/* ================= APPEARANCE ================= */}
        <section className="mb-10">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Editor View</label>
              <select
                value={editorView}
                onChange={(e) => setEditorView(e.target.value)}
                className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-800"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>
        </section>

        {/* ================= RESUME PREFERENCES ================= */}
        <section className="mb-10">
          <h2 className="text-lg font-medium mb-4">Resume Preferences</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Paper Size</label>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value)}
                className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-800"
              >
                <option value="A4">A4 (Recommended)</option>
                <option value="US">US Letter</option>
              </select>
            </div>

            <Toggle
              label="Auto-save while editing"
              value={autoSave}
              onChange={setAutoSave}
            />

            <Toggle
              label="Enable section drag & drop"
              value={dragDrop}
              onChange={setDragDrop}
            />
          </div>
        </section>

        {/* ================= SMART FEATURES ================= */}
        <section className="mb-10">
          <h2 className="text-lg font-medium mb-4">Smart Features</h2>

          <div className="space-y-3">
            <Toggle
              label="Show resume strength indicator"
              value={resumeStrength}
              onChange={setResumeStrength}
            />

            <Toggle
              label="Auto-scroll to weak sections"
              value={autoScrollWeak}
              onChange={setAutoScrollWeak}
            />

            <Toggle
              label="ATS keyword warnings"
              value={atsWarnings}
              onChange={setAtsWarnings}
            />
          </div>
        </section>

        {/* ================= NOTIFICATIONS ================= */}
        <section className="mb-10">
          <h2 className="text-lg font-medium mb-4">Notifications</h2>

          <Toggle
            label="Email notifications"
            value={emailNotifications}
            onChange={setEmailNotifications}
          />
        </section>

        {/* ================= DANGER ZONE ================= */}
        <section className="border-t pt-6">
          <h2 className="text-lg font-medium text-red-600 mb-4">
            Danger Zone
          </h2>

          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            Delete Account
          </button>
        </section>
      </div>
    </PageTransition>
  );
}

/* ================= TOGGLE COMPONENT ================= */
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
