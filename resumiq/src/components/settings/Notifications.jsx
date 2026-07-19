import { useEffect, useState } from "react";

export default function Notifications() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [resumeReminders, setResumeReminders] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(false);
  const [frequency, setFrequency] = useState("Instant");

  /* ---------------- Load Saved Settings ---------------- */

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notificationSettings"));

    if (saved) {
      setEmailNotifications(saved.emailNotifications ?? true);
      setResumeReminders(saved.resumeReminders ?? false);
      setProductUpdates(saved.productUpdates ?? true);
      setJobAlerts(saved.jobAlerts ?? false);
      setFrequency(saved.frequency ?? "Instant");
    }
  }, []);

  /* ---------------- Save Settings ---------------- */

  useEffect(() => {
    localStorage.setItem(
      "notificationSettings",
      JSON.stringify({
        emailNotifications,
        resumeReminders,
        productUpdates,
        jobAlerts,
        frequency,
      })
    );
  }, [
    emailNotifications,
    resumeReminders,
    productUpdates,
    jobAlerts,
    frequency,
  ]);

  const enabledCount = [
    emailNotifications,
    resumeReminders,
    productUpdates,
    jobAlerts,
  ].filter(Boolean).length;

  const sendTestNotification = () => {
    alert("✅ Test notification sent successfully!");
  };

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-3xl font-bold">
          Notifications
        </h2>

        <p className="text-gray-500 mt-2">
          Manage how Resumiq keeps you informed.
        </p>
      </div>

      {/* ================= Statistics ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="card p-6 rounded-xl border">
          <p className="text-sm text-gray-500">
            Active Notifications
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {enabledCount}
          </h2>
        </div>

        <div className="card p-6 rounded-xl border">
          <p className="text-sm text-gray-500">
            Notification Frequency
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {frequency}
          </h2>
        </div>

        <div className="card p-6 rounded-xl border">
          <p className="text-sm text-gray-500">
            Last Activity
          </p>

          <h2 className="text-lg font-semibold mt-2">
            Resume Saved
          </h2>

          <p className="text-gray-500 text-sm">
            Today • 4:15 PM
          </p>
        </div>

      </div>

      {/* ================= Main Grid ================= */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* LEFT SIDE */}

        <div className="space-y-6">

          <div className="card border rounded-xl p-6">

            <h3 className="text-lg font-semibold mb-6">
              Email Notifications
            </h3>

            <div className="space-y-5">

              <Toggle
                label="Email notifications"
                description="Receive important account updates."
                value={emailNotifications}
                onChange={setEmailNotifications}
              />

              <Toggle
                label="Resume reminders"
                description="Receive reminders to keep your resume updated."
                value={resumeReminders}
                onChange={setResumeReminders}
              />

            </div>

          </div>

          <div className="card border rounded-xl p-6">

            <h3 className="text-lg font-semibold mb-6">
              Career Notifications
            </h3>

            <div className="space-y-5">

              <Toggle
                label="Product updates"
                description="Know when new templates and features are released."
                value={productUpdates}
                onChange={setProductUpdates}
              />

              <Toggle
                label="Job-ready alerts"
                description="Receive alerts when your resume becomes job-ready."
                value={jobAlerts}
                onChange={setJobAlerts}
              />

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="space-y-6">

          <div className="card border rounded-xl p-6">

            <h3 className="text-lg font-semibold mb-4">
              Notification Frequency
            </h3>

            <select
              className="w-full border rounded-lg px-4 py-3"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option>Instant</option>
              <option>Daily Digest</option>
              <option>Weekly Digest</option>
            </select>

          </div>

          <div className="card border rounded-xl p-6">

            <h3 className="text-lg font-semibold mb-5">
              Recent Notifications
            </h3>

            <div className="space-y-5">

              <div className="border-b pb-4">
                <p className="font-medium">
                  📄 Resume exported successfully
                </p>

                <p className="text-sm text-gray-500">
                  Today • 3:42 PM
                </p>
              </div>

              <div className="border-b pb-4">
                <p className="font-medium">
                  💾 Resume auto-saved
                </p>

                <p className="text-sm text-gray-500">
                  Yesterday • 8:11 PM
                </p>
              </div>

              <div>
                <p className="font-medium">
                  🚀 New Modern Resume Template Added
                </p>

                <p className="text-sm text-gray-500">
                  3 Days Ago
                </p>
              </div>

            </div>

          </div>

          <div className="card border rounded-xl p-6">

            <h3 className="text-lg font-semibold">
              Test Notification
            </h3>

            <p className="text-gray-500 mt-2 mb-5">
              Send yourself a sample notification to verify everything is working correctly.
            </p>

            <button
              onClick={sendTestNotification}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg transition"
            >
              Send Test Notification
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

/* ================= Toggle Component ================= */

function Toggle({
  label,
  description,
  value,
  onChange,
}) {
  return (
    <div className="flex items-start justify-between gap-5">

      <div>

        <h4 className="font-medium">
          {label}
        </h4>

        <p className="text-sm text-gray-500 mt-1">
          {description}
        </p>

      </div>

      <input
        type="checkbox"
        checked={value}
        onChange={() => onChange(!value)}
        className="w-5 h-5 mt-1 cursor-pointer"
      />

    </div>
  );
}