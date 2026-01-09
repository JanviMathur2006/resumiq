export default function Appearance() {
  return (
    <section>
      <h2 className="text-lg font-medium mb-4">Appearance</h2>

      <div className="space-y-3">
        <select className="input">
          <option>Light</option>
          <option>Dark</option>
          <option>System</option>
        </select>

        <select className="input">
          <option>Comfortable Editor</option>
          <option>Compact Editor</option>
        </select>
      </div>
    </section>
  );
}
