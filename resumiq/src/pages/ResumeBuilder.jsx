import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ResumeStrength from "../components/ResumeStrength";

const MAX_VERSIONS = 10;

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
  const [versions, setVersions] = useState([]);

  /* ================= REFS ================= */
  const summaryRef = useRef(null);
  const educationRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);

  /* ================= LOAD HISTORY ================= */
  useEffect(() => {
    const storedVersions =
      JSON.parse(localStorage.getItem("resumeVersions")) || [];
    setVersions(storedVersions);

    const storedData =
      JSON.parse(localStorage.getItem("resumeData")) || null;
    if (storedData) setResumeData(storedData);
  }, []);

  /* ================= CHANGE HANDLER ================= */
  const handleChange = (field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value }));
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

  /* ================= SECTION STATUS ================= */
  const sectionStatus = {
    summary: resumeData.summary.length > 30,
    education: resumeData.education.length > 20,
    experience: resumeData.experience.length > 50,
    projects: resumeData.projects.length > 40,
    skills: resumeData.skills.length > 10,
  };

  /* ================= TIPS ================= */
  const improvementTips = useMemo(() => {
    const tips = [];
    if (!sectionStatus.summary)
      tips.push("Add a stronger professional summary (2–3 lines).");
    if (!sectionStatus.education)
      tips.push("Add complete education details.");
    if (!sectionStatus.experience)
      tips.push("Add or expand your work experience.");
    if (!sectionStatus.projects)
      tips.push("Add relevant projects.");
    if (!sectionStatus.skills)
      tips.push("Add more relevant skills.");
    return tips;
  }, [sectionStatus]);

  /* ================= AUTO SAVE + VERSIONING ================= */
  useEffect(() => {
    setSaveStatus("Saving…");

    const timeout = setTimeout(() => {
      const timestamp = Date.now();
      const newVersion = {
        id: timestamp,
        data: resumeData,
        savedAt: timestamp,
      };

      const updatedVersions = [
        newVersion,
        ...versions,
      ].slice(0, MAX_VERSIONS);

      localStorage.setItem("resumeData", JSON.stringify(resumeData));
      localStorage.setItem(
        "resumeVersions",
        JSON.stringify(updatedVersions)
      );

      setVersions(updatedVersions);
      setLastSavedAt(timestamp);
      setSaveStatus("Saved");
    }, 800);

    return () => clearTimeout(timeout);
  }, [resumeData]);

  const getSaveText = () => {
    if (!lastSavedAt) return "Not saved yet";
    const s = Math.floor((Date.now() - lastSavedAt) / 1000);
    if (s < 3) return "Saved just now";
    if (s < 60) return `Saved ${s}s ago`;
    return `Saved ${Math.floor(s / 60)} min ago`;
  };

  const restoreVersion = (v) => {
    if (window.confirm("Restore this version?")) {
      setResumeData(v.data);
    }
  };

  const handlePreview = () => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    navigate("/resume-preview");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* ================= LEFT: BUILDER ================= */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold">Resume Builder</h1>

        <ResumeStrength score={resumeScore} />

        <Section
          refProp={summaryRef}
          title="Professional Summary"
          value={resumeData.summary}
          onChange={(v) => handleChange("summary", v)}
        />
        <Section
          refProp={educationRef}
          title="Education"
          value={resumeData.education}
          onChange={(v) => handleChange("education", v)}
        />
        <Section
          refProp={experienceRef}
          title="Experience"
          value={resumeData.experience}
          onChange={(v) => handleChange("experience", v)}
        />
        <Section
          refProp={projectsRef}
          title="Projects"
          value={resumeData.projects}
          onChange={(v) => handleChange("projects", v)}
        />
        <Section
          refProp={skillsRef}
          title="Skills"
          value={resumeData.skills}
          onChange={(v) => handleChange("skills", v)}
        />

        {improvementTips.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <h3 className="font-semibold mb-2">
              💡 Tips to improve your resume
            </h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {improvementTips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t">
          <span className="text-sm text-gray-500">
            {saveStatus === "Saving…" ? "Saving…" : getSaveText()}
          </span>

          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              className="px-5 py-2 rounded-lg border bg-white"
            >
              Preview
            </button>
            <button className="px-5 py-2 rounded-lg bg-black text-white">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* ================= RIGHT: VERSION HISTORY ================= */}
      <div className="bg-white border rounded-xl p-5 h-fit">
        <h3 className="font-semibold mb-4">🕘 Version History</h3>

        {versions.length === 0 && (
          <p className="text-sm text-gray-500">
            No versions yet
          </p>
        )}

        <ul className="space-y-3">
          {versions.map((v, i) => (
            <li
              key={v.id}
              className="flex justify-between items-center text-sm"
            >
              <span>
                Version {versions.length - i} ·{" "}
                {new Date(v.savedAt).toLocaleTimeString()}
              </span>
              <button
                onClick={() => restoreVersion(v)}
                className="text-blue-600 hover:underline"
              >
                Restore
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ================= SECTION ================= */
function Section({ title, value, onChange, refProp }) {
  return (
    <div ref={refProp} className="bg-white border rounded-xl p-6">
      <h2 className="font-semibold mb-2">{title}</h2>
      <textarea
        className="w-full min-h-[120px] border rounded-lg p-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
