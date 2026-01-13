import { useState } from "react";
import {
  User,
  Lock,
  Palette,
  Bell,
  FileText,
  AlertTriangle,
} from "lucide-react";

import AccountPrivacy from "./AccountPrivacy";
import Security from "./Security";
import Appearance from "./Appearance";
import Notifications from "./Notifications";
import ResumeSettings from "./ResumeSettings";
import DangerZone from "./DangerZone";

/* ===========================
   SIDEBAR CONFIG
=========================== */
const tabs = [
  { label: "Account", key: "Account", icon: User },
  { label: "Security", key: "Security", icon: Lock },
  { label: "Appearance", key: "Appearance", icon: Palette },
  { label: "Notifications", key: "Notifications", icon: Bell },
  { label: "Resume Defaults", key: "Resume", icon: FileText },
  { label: "Danger Zone", key: "Danger Zone", icon: AlertTriangle, danger: true },
];

export default function SettingsLayout() {
  const [active, setActive] = useState("Account");

  /* ===========================
     RENDER ACTIVE TAB
  =========================== */
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
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B1220]">
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">

        {/* ===========================
            SIDEBAR
        =========================== */}
        <aside className="w-64 rounded-2xl bg-[#0F172A] text-slate-300 p-5 flex flex-col">
          <h1 className="text-white text-lg font-semibold mb-6">
            Settings
          </h1>

          <nav className="space-y-1 flex-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActive(tab.key)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm
                    transition-all
                    ${
                      isActive
                        ? "bg-white text-black"
                        : tab.danger
                        ? "text-red-400 hover:bg-red-500/10"
                        : "hover:bg-white/10"
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* USER FOOTER (OPTIONAL, CLEAN) */}
          <div className="border-t border-white/10 pt-4 text-xs text-slate-400">
            <p className="font-medium text-slate-300">Resumiq</p>
            <p>Settings Panel</p>
          </div>
        </aside>

        {/* ===========================
            CONTENT AREA
        =========================== */}
        <main className="flex-1">
          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {active}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your {active.toLowerCase()} preferences
              </p>
            </div>

            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
              Saved ✓
            </div>
          </div>

          {/* CONTENT CARD */}
          <section className="bg-white dark:bg-[#0F172A] rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-white/10">
            {renderTab()}
          </section>
        </main>

      </div>
    </div>
  );
}
