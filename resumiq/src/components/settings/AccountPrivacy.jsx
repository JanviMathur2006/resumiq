export default function AccountPrivacy() {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Account & Privacy</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm">Display Name</label>
          <input className="input" placeholder="Public name" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Show real name on resumes</span>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Allow profile discovery</span>
        </div>
      </div>
    </>
  );
}
