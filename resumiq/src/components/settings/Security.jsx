import { useEffect, useState } from "react";

export default function Security() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  /* -------- Load saved security settings -------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("securitySettings"));
    if (saved) {
      setTwoFactor(saved.twoFactor ?? false);
      setLoginAlerts(saved.loginAlerts ?? true);
    }
  }, []);

  /* -------- Save on change -------- */
  useEffect(() => {
    localStorage.setItem(
      "securitySettings",
      JSON.stringify({
        twoFactor,
        loginAlerts,
      })
    );
  }, [twoFactor, loginAlerts]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Security
      </h2>

      <div className="space-y-8 max-w-lg">

        {/* -------- Change Password -------- */}
        <div className="card">
          <h3 className="font-medium mb-2">Password</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Change your password regularly to keep your account secure.
          </p>
          <button className="btn">
            Change Password
          </button>
        </div>

        {/* -------- Two Factor Auth -------- */}
        <Toggle
          label="Two-Factor Authentication (2FA)"
          description="Add an extra layer of security during login."
          value={twoFactor}
          onChange={setTwoFactor}
        />

        {/* -------- Login Alerts -------- */}
        <Toggle
          label="Login Alerts"
          description="Get notified when a new device logs into your account."
          value={loginAlerts}
          onChange={setLoginAlerts}
        />

        {/* -------- Active Sessions -------- */}
        <div className="card">
          <h3 className="font-medium mb-2">Active Sessions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            You’re currently logged in on this device.
          </p>
          <button className="btn">
            Log out from all devices
          </button>
        </div>

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
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      <input
        type="checkbox"
        checked={value}
        onChange={() => onChange(!value)}
      />
    </div>
  );
}
