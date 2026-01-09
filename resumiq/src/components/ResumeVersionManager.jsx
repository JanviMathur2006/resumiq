import { useEffect, useState } from "react";

export default function ResumeVersionManager({ onChange }) {
  const [versions, setVersions] = useState([]);
  const [activeId, setActiveId] = useState(null);

  /* ---------- Load ---------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeVersions"));

    if (saved) {
      setVersions(saved.versions);
      setActiveId(saved.activeVersionId);
    } else {
      const initial = {
        id: "v1",
        name: "Default Resume",
        data: {},
        history: [],
      };

      setVersions([initial]);
      setActiveId("v1");

      localStorage.setItem(
        "resumeVersions",
        JSON.stringify({
          versions: [initial],
          activeVersionId: "v1",
        })
      );
    }
  }, []);

  /* ---------- Save ---------- */
  useEffect(() => {
    if (!versions.length) return;

    localStorage.setItem(
      "resumeVersions",
      JSON.stringify({
        versions,
        activeVersionId: activeId,
      })
    );

    const active = versions.find(v => v.id === activeId);
    onChange?.(active);
  }, [versions, activeId]);

  /* ---------- Actions ---------- */
  const createVersion = () => {
    const id = "v" + Date.now();
    const newVersion = {
      id,
      name: "New Resume",
      data: {},
      history: [],
    };

    setVersions([...versions, newVersion]);
    setActiveId(id);
  };

  const renameVersion = (id, name) => {
    setVersions(
      versions.map(v => v.id === id ? { ...v, name } : v)
    );
  };

  const deleteVersion = (id) => {
    if (versions.length === 1) return;

    const filtered = versions.filter(v => v.id !== id);
    setVersions(filtered);
    setActiveId(filtered[0].id);
  };

  return (
    <div className="card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Resume Versions</h3>
        <button className="btn" onClick={createVersion}>
          + New Version
        </button>
      </div>

      <div className="space-y-3">
        {versions.map(v => (
          <div
            key={v.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              v.id === activeId ? "bg-gray-100 dark:bg-gray-800" : ""
            }`}
          >
            <input
              value={v.name}
              onChange={(e) => renameVersion(v.id, e.target.value)}
              className="bg-transparent border-none font-medium outline-none"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setActiveId(v.id)}
                className="text-sm text-blue-600"
              >
                Open
              </button>

              {versions.length > 1 && (
                <button
                  onClick={() => deleteVersion(v.id)}
                  className="text-sm text-red-500"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
