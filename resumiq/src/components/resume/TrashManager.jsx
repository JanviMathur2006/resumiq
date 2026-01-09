export default function TrashManager({ deleted, onRestore, onDeleteForever }) {
  if (!deleted.length) {
    return <p className="text-sm text-gray-500">Trash is empty.</p>;
  }

  return (
    <div className="border rounded-xl p-4 mt-6">
      <h3 className="font-semibold mb-3">Trash</h3>

      <div className="space-y-3">
        {deleted.map(v => (
          <div
            key={v.id}
            className="flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{v.name}</p>
              <p className="text-xs text-gray-500">
                Deleted {Math.floor((Date.now() - v.deletedAt) / 86400000)} day(s) ago
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="text-blue-600"
                onClick={() => onRestore(v.id)}
              >
                Restore
              </button>

              <button
                className="text-red-600"
                onClick={() => onDeleteForever(v.id)}
              >
                Delete Forever
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
