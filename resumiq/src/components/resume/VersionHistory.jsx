export default function VersionHistory({ history, onRestore }) {
  if (!history.length) {
    return <p className="text-sm text-gray-500">No history yet.</p>;
  }

  return (
    <div className="border rounded-xl p-4">
      <h3 className="font-semibold mb-3">Version History</h3>

      <div className="space-y-3 max-h-64 overflow-auto">
        {history.slice().reverse().map((h, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium">{h.action}</p>
              <p className="text-xs text-gray-500">
                {new Date(h.time).toLocaleString()}
              </p>
            </div>

            <button
              className="text-sm text-blue-600"
              onClick={() =>
                onRestore(h.dataSnapshot, h.styleSnapshot)
              }
            >
              Restore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
