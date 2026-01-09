import { useEffect, useState } from "react";

export default function ResumeSettings() {
  const [autoSave, setAutoSave] = useState(true);
  const [dragDrop, setDragDrop] = useState(true);
  const [resumeStrength, setResumeStrength] = useState(true);
  const [atsWarnings, setAtsWarnings] = useState(false);
  const [autoScrollWeak, setAutoScrollWeak] = useState(false);
  const [paperSize, setPaperSize] = useState("A4");
  const [resumeLanguage, setResumeLanguage] = useState("en");

  /* ---------- Load saved resume settings ---------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resumeSettings"));
    if (saved) {
      setAutoSave(saved.autoSave ?? true);
      setDragDrop(saved.dragDrop ?? true);
      setResumeStrength(saved.resumeStrength ?? true);
      setAtsWarnings(saved.atsWarnings ?? false);
      setAutoScrollWeak(saved.autoScrollWeak ?? false);
      setPaperSize(saved.paperSize ?? "A4");
      setResumeLanguage(saved.resumeLanguage ?? "en");
    }
  }, []);

  /* ---------- Save on change ---------- */
  useEffect(() => {
    localStorage.setItem(
      "resumeSettings",
      JSON.stringify({
        autoSave,
        dragDrop,
        resumeStrength,
        atsWarnings,
        autoScrollWeak,
        paperSize,
        resumeLanguage,
      })
    );
  }, [
    autoSave,
    dragDrop,
    resumeStrength,
    atsWarnings,
    autoScrollWeak,
    paperSize,
    resumeLanguage,
  ]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Resume Settings
      </h2>

      <div className="space-y-8 max-w-lg">

        {/* -------- Editor Behavior -------- */}
        <div className="card space-y-4">
          <h3 className="font-medium">Editor Behavior</h3>

          <Toggle
            label="Auto-save while editing"
            description="Automatically save changes as you type."
            value={autoSave}
            onChange={setAutoSave}
          />

          <Toggle
            label="Enable section drag & drop"
            description="Reorder resume sections using drag and drop."
            value={dragDrop}
            onChange={setDragDrop}
          />
        </div>

        {/* -------- Smart Resume Features -------- */}
        <div className="card space-y-4">
          <h3 className="font-medium">Smart Features</h3>

          <Toggle
            label="Resume strength indicator"
            description="Show resume quality score while editing."
            value={resumeStrength}
            onChange={setResumeStrength}
          />

          <Toggle
            label="ATS keyword warnings"
            description="Get alerts when important keywords are missing."
            value={atsWarnings}
            onChange={setAtsWarnings}
          />

          <Toggle
            label="Auto-scroll to weak sections"
            description="Jump to sections that need improvement."
            value={autoScrollWeak}
            onChange={setAutoScrollWeak}
          />
        </div>

        {/* -------- Format Preferences -------- */}
        <div className="card space-y-4">
          <h3 className="font-medium">Format Preferences</h3>

          <div>
            <label className="block text-sm mb-1">
              Paper Size
            </label>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value)}
              className="input"
            >
              <option value="A4">A4 (Recommended)</option>
              <option value="US">US Letter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">
              Resume Language
            </label>
            <select
              value={resumeLanguage}
              onChange={(e) => setResumeLanguage(e.target.value)}
              className="input"
            >
              <option value="en">English</option>
              <option value="en-uk">English (UK)</option>
            </select>
          </div>
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
