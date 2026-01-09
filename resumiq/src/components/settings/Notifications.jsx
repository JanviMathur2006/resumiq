export default function Notifications() {
  return (
    <section>
      <h2 className="text-lg font-medium mb-4">Notifications</h2>

      <label className="flex items-center gap-2">
        <input type="checkbox" defaultChecked />
        Email notifications
      </label>
    </section>
  );
}
