export default function SmartFeatures() {
  return (
    <section>
      <h2 className="text-lg font-medium mb-4">Smart Features</h2>

      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked />
          Show resume strength indicator
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Auto-scroll to weak sections
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" />
          ATS keyword warnings
        </label>
      </div>
    </section>
  );
}
