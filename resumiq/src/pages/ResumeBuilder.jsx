import { useState, useMemo, useEffect, useRef } from "react";
import ResumeStrength from "../components/ResumeStrength";

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState({
    summary: "",
    education: "",
    experience: "",
    projects: "",
    skills: "",
  });

  /* ================= REFS FOR AUTO SCROLL ================= */
  const summaryRef = useRef(null);
  const educationRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);

  const handleChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ================= RESUME SCORE ================= */
  const resumeScore = useMemo(() => {
    let score = 0;

    if (resumeData.summary.trim().length > 30) score += 10;
    if (resumeData.education.trim().length > 20) score += 15;
    if (resumeData.experience.trim().length > 50) score += 25;
    if (resumeData.projects.trim().length > 40) score += 20;
    if (resumeData.skills.trim().length > 10) score += 20;

    return Math.min(score, 100);
  }, [resumeData]);

  /* ================= SECTION STATUS (LOGIC ONLY) ================= */
  const sectionStatus = {
    summary: resumeData.summary.trim().length > 30,
    education: resumeData.education.trim().length > 20,
    experience: resumeData.experience.trim().length > 50,
    projects: resumeData.projects.trim().length > 40,
    skills: resumeData.skills.trim().length > 10,
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
      tips.push("Add relevant projects to strengthen your profile.");
    if (!sectionStatus.skills)
      tips.push("Add more relevant skills.");

    return tips;
  }, [sectionStatus]);

  /* ================= AUTO SCROLL (SILENT) ================= */
  useEffect(() => {
    const sections = [
      { key: "summary", ref: summaryRef },
      { key: "education", ref: educationRef },
      { key: "experience", ref: experienceRef },
      { key: "projects", ref: projectsRef },
      { key: "skills", ref: skillsRef },
    ];

    const firstWeak = sections.find(
      (section) => !sectionStatus[section.key]
    );

    if (firstWeak?.ref.current) {
      firstWeak.ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []); // run once on page load

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resume Builder
        </h1>
        <p className="text-gray-600">
          Fill in your details and improve your resume strength.
        </p>
      </div>

      {/* RESUME STRENGTH */}
      <ResumeStrength score={resumeScore} />

      {/* FORM (NORMAL LOOK) */}
      <div className="grid gap-6">

        <div ref={summaryRef}>
          <Section
            title="Professional Summary"
            placeholder="Write a short summary about yourself..."
            value={resumeData.summary}
            onChange={(v) => handleChange("summary", v)}
          />
        </div>

        <div ref={educationRef}>
          <Section
            title="Education"
            placeholder="Enter your education details..."
            value={resumeData.education}
            onChange={(v) => handleChange("education", v)}
          />
        </div>

        <div ref={experienceRef}>
          <Section
            title="Experience"
            placeholder="Describe your work experience..."
            value={resumeData.experience}
            onChange={(v) => handleChange("experience", v)}
          />
        </div>

        <div ref={projectsRef}>
          <Section
            title="Projects"
            placeholder="Mention projects you have worked on..."
            value={resumeData.projects}
            onChange={(v) => handleChange("projects", v)}
          />
        </div>

        <div ref={skillsRef}>
          <Section
            title="Skills"
            placeholder="List your skills (comma separated)..."
            value={resumeData.skills}
            onChange={(v) => handleChange("skills", v)}
          />
        </div>

      </div>

      {/* ================= TIPS AT THE END ================= */}
      {improvementTips.length > 0 && (
        <div className="mt-10 bg-yellow-50 border border-yellow-200
                        rounded-xl p-5">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">
            💡 Tips to improve your resume
          </h3>

          <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
            {improvementTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

/* ================= SECTION COMPONENT (NORMAL) ================= */
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
