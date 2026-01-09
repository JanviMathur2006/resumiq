import { useState } from "react";

import AccountPrivacy from "./AccountPrivacy";
import Security from "./Security";
import Appearance from "./Appearance";
import Notifications from "./Notifications";
import ResumeSettings from "./ResumeSettings";
import DangerZone from "./DangerZone";

const tabs = [
  { label: "Account", key: "Account" },
  { label: "Security", key: "Security" },
  { label: "Appearance", key: "Appearance" },
  { label: "Notifications", key: "Notifications" },
  { label: "Resume", key: "Resume" },
  { label: "Danger Zone", key: "Danger Zone" },
];

export default function SettingsLayout() {
  const [active, setActive] = useState("Account");

  const renderTab = () => {
    switch (active) {
      case "Account":
        return <AccountPrivacy />;
      case "Security":
        return <Security />;
      case "Appearance":
        return <Appearance />;
      case "Notifications":
        return <Notifications />;
      case "Resume":
        return <ResumeSettings />;
      case "Danger Zone":
        return <DangerZone />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <div className="max-w-6xl mx-auto flex gap-8 px-6">

        {/* ================= SIDEBAR ================= */}
        <aside className="w-64 shrink-0">
          <h1 className="text-xl font-semibold mb-6 text-black dark:text-white">
            Settings
          </h1>

          <div className="space-y-1">
            {tabs.map((tab) => {
              const isActive = active === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActive(tab.key)}
                  className={`
                    w-full text-left px-4 py-2 rounded-lg text-sm transition
                    ${
                      isActive
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                    }
                    ${tab.key === "Danger Zone" && !isActive ? "text-red-600 dark:text-red-500" : ""}
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ================= CONTENT ================= */}
        <section className="flex-1 bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm">
          {renderTab()}
        </section>

      </div>
    </div>
  );
}
