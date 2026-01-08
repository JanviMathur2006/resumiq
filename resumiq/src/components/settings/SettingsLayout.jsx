import { useState } from "react";
import AccountPrivacy from "./AccountPrivacy";
import Security from "./Security";
import Appearance from "./Appearance";
import Notifications from "./Notifications";
import ResumeSettings from "./ResumeSettings";
import DangerZone from "./DangerZone";

const tabs = [
  "Account",
  "Security",
  "Appearance",
  "Notifications",
  "Resume",
  "Danger Zone",
];

export default function SettingsLayout() {
  const [active, setActive] = useState("Account");

  const renderTab = () => {
    switch (active) {
      case "Account": return <AccountPrivacy />;
      case "Security": return <Security />;
      case "Appearance": return <Appearance />;
      case "Notifications": return <Notifications />;
      case "Resume": return <ResumeSettings />;
      case "Danger Zone": return <DangerZone />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex gap-8 p-8">
      
      {/* Sidebar */}
      <aside className="w-64 space-y-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              active === tab ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </aside>

      {/* Content */}
      <section className="flex-1 bg-white rounded-xl p-8 shadow-sm">
        {renderTab()}
      </section>
    </div>
  );
}
