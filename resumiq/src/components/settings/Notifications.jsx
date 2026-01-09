import { useEffect, useState } from "react";

export default function Notifications() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [resumeReminders, setResumeReminders] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(false);

  /* ---------- Load saved notification settings ---------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notificationSettings"));
    if (saved) {
      setEmailNotifications(saved.emailNotifications ?? true);
      setResumeReminders(saved.resumeReminders ?? false);
      setProductUpdates(saved.productUpdates ?? true);
      setJobAlerts(saved.jobAlerts ?? false);
    }
  }, []);

  /* ---------- Save on change ---------- */
  useEffect(() => {
    localStorage.setItem(
      "notificationSettings",
      JSON.stringify({
        emailNotifications,
        resumeReminders,
        productUpdates,
        jobAlerts,
      })
    );
  }, [
    emailNotifications,
    resumeReminders,
    productUpdates,
    jobAlerts,
  ]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Notifications
      </h2>

      <div className="space-y-8 max-w-lg">

        {/* -------- Email Notifications -------- */}
        <div className="card space-y-4">
          <h3 className="font-medium">Email Notifications</h3>

          <Toggle
            label="Email notifications"
            description="Receive important updates via email."
            value={emailNotifications}
            onChange={setEmailNotifications}
          />

          <Toggle
            label="Resume update reminders"
            description="Get reminders to keep your resume up to date."
            value={resumeReminders}
            onChange={setResumeReminders}
          />
        </div>

        {/* -------- Product & Career -------- */}
        <div className="card space-y-4">
          <h3 className="font-medium">Product & Career</h3>

          <Toggle
            label="Product updates"
            description="Be notified about new features and improvements."
            value={productUpdates}
            onChange={setProductUpdates}
          />

          <Toggle
            label="Job-ready alerts"
            description="Get alerts when your resume is job-ready."
            value={jobAlerts}
            onChange={setJobAlerts}
          />
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
