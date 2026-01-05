import { useState, useMemo } from "react";
import ResumeStrength from "../components/ResumeStrength";

/*
  Simple resume data structure
  (Later this can come from Firebase / context)
*/
export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState({
    summary: "",
    education: "",
    experience: "",
    projects: "",
    skills: "",
  });

  /* ================= UPDATE HANDLER ================= */
  const handleChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ================= STRENGTH CALCULATION ================= */
  const resumeScore = useMemo(() => {
    let score = 0;

    if (resumeData.summary.trim().length > 30) score += 10;
    if (resumeData.education.trim().length > 20) score += 15;
    if (resumeData.experience.trim().length > 50) score += 25;
    if (resumeData.projects.trim().length > 40) score += 20;
    if (resumeData.skills.trim().length > 10) score += 20;

    return Math.min(score, 100);
  }, [resumeData]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resume Builder
        </h1>
        <p className="text-gray-600">
          Fill in your details and improve your resume strength.
        </p>
      </div>

      {/* ================= RESUME STRENGTH ================= */}
      <ResumeStrength score={resumeScore} />

      {/* ================= FORM ================= */}
      <div className="grid gap-6">

        {/* SUMMARY */}
        <Section
          title="Professional Summary"
          placeholder="Write a short summary about yourself..."
          value={resumeData.summary}
          onChange={(v) => handleChange("summary", v)}
        />

        {/* EDUCATION */}
        <Section
          title="Education"
          placeholder="Enter your education details..."
          value={resumeData.education}
          onChange={(v) => handleChange("education", v)}
        />

        {/* EXPERIENCE */}
        <Section
          title="Experience"
          placeholder="Describe your work experience..."
          value={resumeData.experience}
          onChange={(v) => handleChange("experience", v)}
        />

        {/* PROJECTS */}
        <Section
          title="Projects"
          placeholder="Mention projects you have worked on..."
          value={resumeData.projects}
          onChange={(v) => handleChange("projects", v)}
        />

        {/* SKILLS */}
        <Section
          title="Skills"
          placeholder="List your skills (comma separated)..."
          value={resumeData.skills}
          onChange={(v) => handleChange("skills", v)}
        />

      </div>

    </div>
  );
}

/* ================= REUSABLE SECTION COMPONENT ================= */
function Section({ title, placeholder, value, onChange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
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
