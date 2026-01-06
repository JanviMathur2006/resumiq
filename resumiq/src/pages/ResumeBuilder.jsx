import { useState, useMemo, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ResumeStrength from "../components/ResumeStrength";

export default function ResumeBuilder() {
  const pdfRef = useRef(null);

  /* ================= STATE ================= */
  const [resumeData, setResumeData] = useState({
    name: "Your Name",
    title: "Software Engineer",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
    experience: "",
    projects: "",
    education: "",
    skills: "",
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const hasPreviewContent =
    resumeData.summary ||
    resumeData.experience ||
    resumeData.projects ||
    resumeData.education ||
    resumeData.skills;

  /* ================= LOAD ================= */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("resumeData"));
    if (stored) setResumeData(stored);
  }, []);

  /* ================= CHANGE ================= */
  const handleChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ================= AUTO SAVE ================= */
  useEffect(() => {
    setSaveStatus("Saving…");

    const timer = setTimeout(() => {
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
      setLastSavedAt(Date.now());
      setSaveStatus("Saved");
    }, 800);

    return () => clearTimeout(timer);
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

  /* ================= PDF ================= */
  const downloadPDF = async () => {
    if (!hasPreviewContent) return;

    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-6">
        Resume Builder
      </h1>

      <ResumeStrength score={resumeScore} />

      {/* ================= EDIT MODE ================= */}
      {!previewMode && (
        <div className="space-y-6 mt-6">

          {/* CONTACT DETAILS */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Contact Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Email"
                value={resumeData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="border rounded-lg p-3"
              />
              <input
                placeholder="Phone"
                value={resumeData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="border rounded-lg p-3"
              />
              <input
                placeholder="Location (City, Country)"
                value={resumeData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="border rounded-lg p-3"
              />
              <input
                placeholder="LinkedIn URL"
                value={resumeData.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                className="border rounded-lg p-3"
              />
            </div>
          </div>

          <Input title="Name" value={resumeData.name}
            onChange={(v) => handleChange("name", v)}
          />
          <Input title="Role / Title" value={resumeData.title}
            onChange={(v) => handleChange("title", v)}
          />

          <Section title="Professional Summary"
            value={resumeData.summary}
            onChange={(v) => handleChange("summary", v)}
          />
          <Section title="Experience"
            value={resumeData.experience}
            onChange={(v) => handleChange("experience", v)}
          />
          <Section title="Projects"
            value={resumeData.projects}
            onChange={(v) => handleChange("projects", v)}
          />
          <Section title="Education"
            value={resumeData.education}
            onChange={(v) => handleChange("education", v)}
          />
          <Section title="Skills"
            value={resumeData.skills}
            onChange={(v) => handleChange("skills", v)}
          />
        </div>
      )}

      {/* ================= PREVIEW MODE ================= */}
      {previewMode && (
        <>
          {hasPreviewContent && (
            <div
              ref={pdfRef}
              className="mt-10 bg-white p-10 max-w-[800px] mx-auto text-black"
            >
              {/* HEADER */}
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold">
                  {resumeData.name}
                </h1>
                <p className="text-gray-600">
                  {resumeData.title}
                </p>

                <div className="mt-2 text-sm text-gray-700 flex flex-wrap justify-center gap-x-4 gap-y-1">
                  {resumeData.email && <span>{resumeData.email}</span>}
                  {resumeData.phone && <span>{resumeData.phone}</span>}
                  {resumeData.location && <span>{resumeData.location}</span>}
                  {resumeData.linkedin && <span>{resumeData.linkedin}</span>}
                </div>
              </div>

              <TemplateSection title="Summary" content={resumeData.summary} />
              <TemplateSection title="Experience" content={resumeData.experience} />
              <TemplateSection title="Projects" content={resumeData.projects} />
              <TemplateSection title="Education" content={resumeData.education} />
              <TemplateSection title="Skills" content={resumeData.skills} />
            </div>
          )}

          {!hasPreviewContent && (
            <p className="mt-10 text-center text-gray-500">
              Add content to preview your resume.
            </p>
          )}
        </>
      )}

      {/* ================= ACTION BAR ================= */}
      <div className="flex justify-between items-center pt-8 mt-8 border-t">
        <span className="text-sm text-gray-500">
          {saveStatus === "Saving…" ? "Saving…" : getSaveText()}
        </span>

        <div className="flex gap-3">
          {!previewMode && (
            <button
              onClick={() => setPreviewMode(true)}
              className="px-6 py-3 rounded-xl bg-black text-white font-semibold"
            >
              Preview Resume
            </button>
          )}

          {previewMode && (
            <>
              <button
                onClick={() => setPreviewMode(false)}
                className="px-6 py-3 rounded-xl border font-semibold"
              >
                Back to Edit
              </button>

              <button
                onClick={downloadPDF}
                disabled={!hasPreviewContent}
                className={`px-6 py-3 rounded-xl font-semibold
                  ${
                    hasPreviewContent
                      ? "bg-black text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }
                `}
              >
                Download PDF
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function Input({ title, value, onChange }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <h2 className="font-semibold mb-2">{title}</h2>
      <input
        className="w-full border rounded-lg p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Section({ title, value, onChange }) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="font-semibold mb-2">{title}</h2>
      <textarea
        className="w-full min-h-[120px] border rounded-lg p-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TemplateSection({ title, content }) {
  if (!content) return null;
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold border-b mb-2">
        {title}
      </h2>
      <p className="text-sm leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}
