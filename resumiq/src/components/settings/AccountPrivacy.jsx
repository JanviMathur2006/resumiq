import { useState, useEffect } from "react";

export default function AccountPrivacy() {
  const [displayName, setDisplayName] = useState("");
  const [showRealName, setShowRealName] = useState(true);
  const [profileDiscovery, setProfileDiscovery] = useState(true);

  /* ---------- Load saved settings (safe) ---------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("accountPrivacy"));
    if (saved) {
      setDisplayName(saved.displayName || "");
      setShowRealName(saved.showRealName ?? true);
      setProfileDiscovery(saved.profileDiscovery ?? true);
    }
  }, []);

  /* ---------- Save on change ---------- */
  useEffect(() => {
    localStorage.setItem(
      "accountPrivacy",
      JSON.stringify({
        displayName,
        showRealName,
        profileDiscovery,
      })
    );
  }, [displayName, showRealName, profileDiscovery]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Account & Privacy
      </h2>

      <div className="space-y-6 max-w-lg">

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Display Name
          </label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Public name"
            className="w-full border rounded-lg p-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">
            This name appears on your profile and shared resumes.
          </p>
        </div>

        {/* Show Real Name */}
        <Toggle
          label="Show real name on resumes"
          description="Your full name will be visible on exported resumes."
          value={showRealName}
          onChange={setShowRealName}
        />

        {/* Profile Discovery */}
        <Toggle
          label="Allow profile discovery"
          description="Allow recruiters to find your public profile."
          value={profileDiscovery}
          onChange={setProfileDiscovery}
        />
      </div>
    </div>
  );
}

/* ================= Toggle Row ================= */
function Toggle({ label, description, value, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <input
        type="checkbox"
        checked={value}
        onChange={() => onChange(!value)}
        className="mt-1"
      />
    </div>
  );
}
