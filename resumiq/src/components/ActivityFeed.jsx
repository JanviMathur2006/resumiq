export default function ActivityFeed({ activities = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Worked on</h2>
        <button className="text-sm text-blue-600 hover:underline">
          View all
        </button>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">
          No recent activity
        </p>
      ) : (
        <ul className="space-y-4">
          {activities.map((item, i) => (
            <li key={i} className="flex gap-3">
              {/* ICON */}
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-semibold">
                {item.type[0]}
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">
                  {item.context} · {item.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
