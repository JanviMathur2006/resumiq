import { useEffect, useState } from "react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [notifications, setNotifications] = useState(true);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      {/* ACCOUNT */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">Account</h2>

        <div className="space-y-3">
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

          <button className="mt-2 text-blue-600 hover:underline">
            Change Password
          </button>
        </div>
      </section>

      {/* PREFERENCES */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">Preferences</h2>

        <div className="flex items-center justify-between mb-4">
          <span>Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Email Notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>
      </section>

      {/* DANGER ZONE */}
      <section>
        <h2 className="text-lg font-medium text-red-600 mb-4">
          Danger Zone
        </h2>

        <button className="bg-red-600 text-white px-4 py-2 rounded">
          Delete Account
        </button>
      </section>
    </div>
  );
}
