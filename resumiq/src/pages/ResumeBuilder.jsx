import { useState, useMemo, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ResumeStrength from "../components/ResumeStrength";

export default function ResumeBuilder() {
  const pdfRef = useRef(null);

  /* ================= STATE ================= */
  const [resumeData, setResumeData] = useState({
    summary: "",
    education: "",
    experience: "",
    projects: "",
    skills: "",
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [lastSavedAt, setLastSavedAt] = useState(null);

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

  /* ================= PDF DOWNLOAD ================= */
  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
    });

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
          <Section title="Professional Summary"
            value={resumeData.summary}
            onChange={(v) => handleChange("summary", v)}
          />

          <Section title="Education"
            value={resumeData.education}
            onChange={(v) => handleChange("education", v)}
          />

          <Section title="Experience"
            value={resumeData.experience}
            onChange={(v) => handleChange("experience", v)}
          />

          <Section title="Projects"
            value={resumeData.projects}
            onChange={(v) => handleChange("projects", v)}
          />

          <Section title="Skills"
            value={resumeData.skills}
            onChange={(v) => handleChange("skills", v)}
          />
        </div>
      )}

      {/* ================= PREVIEW MODE ================= */}
      {previewMode && (
        <div className="mt-10 bg-gray-100 p-6 rounded-xl">
          <div ref={pdfRef} className="bg-white p-10">
            <h1 className="text-3xl font-bold mb-4">Your Name</h1>

            {resumeData.summary && (
              <PDFSection title="Summary">
                {resumeData.summary}
              </PDFSection>
            )}

            {resumeData.experience && (
              <PDFSection title="Experience">
                {resumeData.experience}
              </PDFSection>
            )}

            {resumeData.projects && (
              <PDFSection title="Projects">
                {resumeData.projects}
              </PDFSection>
            )}

            {resumeData.education && (
              <PDFSection title="Education">
                {resumeData.education}
              </PDFSection>
            )}

            {resumeData.skills && (
              <PDFSection title="Skills">
                {resumeData.skills}
              </PDFSection>
            )}
          </div>
        </div>
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
                className="px-6 py-3 rounded-xl bg-black text-white font-semibold"
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

function PDFSection({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold border-b mb-2">
        {title}
      </h2>
      <p>{children}</p>
    </div>
  );
}
