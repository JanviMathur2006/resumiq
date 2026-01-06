import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResumeStrength from "../components/ResumeStrength";

export default function ResumeBuilder() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [resumeData, setResumeData] = useState({
    summary: "",
    education: "",
    experience: "",
    projects: "",
    skills: "",
  });

  const [saveStatus, setSaveStatus] = useState("Saved");
  const [lastSavedAt, setLastSavedAt] = useState(null);

  /* ================= LOAD SAVED DATA ================= */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("resumeData"));
    if (stored) setResumeData(stored);
  }, []);

  /* ================= CHANGE HANDLER ================= */
  const handleChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ================= AUTO SAVE ================= */
  useEffect(() => {
    setSaveStatus("Saving…");

    const timeout = setTimeout(() => {
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
      setLastSavedAt(Date.now());
      setSaveStatus("Saved");
    }, 800);

    return () => clearTimeout(timeout);
  }, [resumeData]);

  const getSaveText = () => {
    if (!lastSavedAt) return "Not saved yet";
    const sec = Math.floor((Date.now() - lastSavedAt) / 1000);
    if (sec < 3) return "Saved just now";
    if (sec < 60) return `Saved ${sec}s ago`;
    return `Saved ${Math.floor(sec / 60)} min ago`;
  };

  /* ================= SCORE ================= */
  const resumeScore = useMemo(() => {
    let score = 0;
    if (resumeData.summary.length > 30) score += 10;
    if (resumeData.education.length > 20) score += 15;
    if (resumeData.experience.length > 50) score += 25;
    if (resumeData.projects.length > 40) score += 20;
    if (resumeData.skills.length > 10) score += 20;
    return Math.min(score, 100);
  }, [resumeData]);

  /* ================= ACTIONS ================= */
  const handlePreview = () => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    navigate("/app/preview");
  };

  const handleSave = () => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    setLastSavedAt(Date.now());
    setSaveStatus("Saved");
    alert("Resume saved successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Resume Builder
      </h1>

      {/* STRENGTH */}
      <ResumeStrength score={resumeScore} />

      {/* FORM */}
      <div className="space-y-6 mt-6">
        <Section
          title="Professional Summary"
          placeholder="Write your professional summary..."
          value={resumeData.summary}
          onChange={(v) => handleChange("summary", v)}
        />

        <Section
          title="Education"
          placeholder="Enter your education details..."
          value={resumeData.education}
          onChange={(v) => handleChange("education", v)}
        />

        <Section
          title="Experience"
          placeholder="Describe your experience..."
          value={resumeData.experience}
          onChange={(v) => handleChange("experience", v)}
        />

        <Section
          title="Projects"
          placeholder="Mention your projects..."
          value={resumeData.projects}
          onChange={(v) => handleChange("projects", v)}
        />

        <Section
          title="Skills"
          placeholder="List your skills (comma separated)..."
          value={resumeData.skills}
          onChange={(v) => handleChange("skills", v)}
        />
      </div>

      {/* SAVE BAR */}
      <div className="flex justify-between items-center pt-8 mt-8 border-t">
        <span className="text-sm text-gray-500">
          {saveStatus === "Saving…" ? "Saving…" : getSaveText()}
        </span>

        <div className="flex gap-4">
          <button
            onClick={handlePreview}
            className="px-6 py-3 rounded-xl bg-white border border-gray-300
                       text-gray-900 font-semibold hover:bg-gray-50"
          >
            Preview
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-black text-white
                       font-semibold hover:bg-gray-900"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= SECTION ================= */
function Section({ title, placeholder, value, onChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        {title}
      </h2>
      <textarea
        className="w-full min-h-[120px] border border-gray-300 rounded-lg
                   px-4 py-3 text-gray-800 focus:outline-none
                   focus:ring-2 focus:ring-black/20"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
