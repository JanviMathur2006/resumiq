export default function ResumePreferences() {
  return (
    <section>
      <h2 className="text-lg font-medium mb-4">Resume Preferences</h2>

      <div className="space-y-3">
        <select className="input">
          <option>A4 (Recommended)</option>
          <option>US Letter</option>
        </select>

        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked />
          Auto-save while editing
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked />
          Enable section drag & drop
        </label>
      </div>
    </section>
  );
}
