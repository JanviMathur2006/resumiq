import { useState } from "react";
import {
  User,
  Lock,
  Palette,
  Bell,
  FileText,
  Shield,
  AlertTriangle,
} from "lucide-react";

import AccountPrivacy from "./AccountPrivacy";
import Security from "./Security";
import Appearance from "./Appearance";
import Notifications from "./Notifications";
import ResumeSettings from "./ResumeSettings";
import DangerZone from "./DangerZone";

/* ===========================
   TERMS COMPONENT
=========================== */
function TermsConditions() {
  return (
    <div className="space-y-6 text-slate-700 dark:text-slate-300">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        Terms & Conditions
      </h2>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          1. Acceptance of Terms
        </h3>
        <p>
          By using Resumiq, you agree to comply with and be bound by these
          Terms & Conditions.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          2. User Accounts
        </h3>
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials and all activities performed under your account.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          3. Resume Content
        </h3>
        <p>
          Users retain ownership of resumes and uploaded content while granting
          Resumiq permission to process data necessary to provide services.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          4. Acceptable Use
        </h3>
        <p>
          Users may not upload harmful, fraudulent, illegal, misleading, or
          offensive content.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          5. Intellectual Property
        </h3>
        <p>
          All platform features, branding, templates, and software remain the
          intellectual property of Resumiq.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          6. Service Availability
        </h3>
        <p>
          Resumiq may temporarily suspend services for maintenance, updates,
          or technical improvements.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          7. Limitation of Liability
        </h3>
        <p>
          Resumiq shall not be liable for indirect or consequential damages
          resulting from platform usage.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          8. Changes to Terms
        </h3>
        <p>
          These terms may be updated periodically. Continued use of the
          platform constitutes acceptance of revised terms.
        </p>
      </div>
    </div>
  );
}

/* ===========================
   PRIVACY COMPONENT
=========================== */
function PrivacyPolicy() {
  return (
    <div className="space-y-6 text-slate-700 dark:text-slate-300">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        Privacy Policy
      </h2>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          Information We Collect
        </h3>
        <p>
          We collect account information, resume data, and settings required
          to provide our services.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          How We Use Data
        </h3>
        <p>
          Information is used to improve resume creation, account management,
          personalization, and service functionality.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          Data Security
        </h3>
        <p>
          We implement reasonable security measures to protect user data from
          unauthorized access.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          Third-Party Services
        </h3>
        <p>
          Certain features may rely on trusted third-party services for
          authentication, analytics, or storage.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">
          User Rights
        </h3>
        <p>
          Users may update, modify, or delete personal information through
          account settings whenever available.
        </p>
      </div>
    </div>
  );
}

/* ===========================
   SIDEBAR TABS
=========================== */
const tabs = [
  { label: "Account", key: "Account", icon: User },
  { label: "Appearance", key: "Appearance", icon: Palette },
  { label: "Resume Preferences", key: "Resume", icon: FileText },
  { label: "Notifications", key: "Notifications", icon: Bell },
  { label: "Security", key: "Security", icon: Lock },
  { label: "Terms & Conditions", key: "Terms", icon: FileText },
  { label: "Privacy Policy", key: "Privacy", icon: Shield },
  {
    label: "Delete Account",
    key: "Danger Zone",
    icon: AlertTriangle,
    danger: true,
  },
];

export default function SettingsLayout() {
  const [active, setActive] = useState("Account");

  const renderTab = () => {
    switch (active) {
      case "Account":
        return <AccountPrivacy />;

      case "Appearance":
        return <Appearance />;

      case "Resume":
        return <ResumeSettings />;

      case "Notifications":
        return <Notifications />;

      case "Security":
        return <Security />;

      case "Terms":
        return <TermsConditions />;

      case "Privacy":
        return <PrivacyPolicy />;

      case "Danger Zone":
        return <DangerZone />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B1220]">
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">

        {/* Sidebar */}
        <aside className="w-72 rounded-2xl bg-[#08112A] text-white p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActive(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    active === tab.key
                      ? "bg-white text-black"
                      : tab.danger
                      ? "text-red-400 hover:bg-red-500/10"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1">
          <section className="bg-white dark:bg-[#0F172A] rounded-2xl p-10 shadow-sm max-h-[80vh] overflow-y-auto">
            {renderTab()}
          </section>
        </main>

      </div>
    </div>
  );
}