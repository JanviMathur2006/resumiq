import { useState, useEffect, useMemo, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ===================================================== */
/* =================== CONSTANTS ======================= */
/* ===================================================== */

const EMPTY_RESUME = {
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
};

const createVersion = (name = "New Resume") => ({
  id: "v_" + Date.now(),
  name,
  data: { ...EMPTY_RESUME },
  history: [],
});

/* ===================================================== */
/* ================= MAIN COMPONENT ==================== */
/* ===================================================== */

export default function ResumeBuilder() {
  const pdfRef = useRef(null);

  /* ------------ Versions ------------ */
  const [versions, setVersions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const activeVersion = versions.find(v => v.id === activeId);

  /* ------------ UI State ------------ */
  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [lastSavedAt, setLastSavedAt] = useState(null);

  /* ===================================================== */
  /* ================= LOAD FROM STORAGE ================= */
  /* ===================================================== */

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("resume_versions_full"));
    if (stored) {
      setVersions(stored.versions);
      setActiveId(stored.activeId);
    } else {
      const initial = createVersion("Default Resume");
      setVersions([initial]);
      setActiveId(initial.id);
    }
  }, []);

  /* ===================================================== */
  /* ================= SAVE TO STORAGE =================== */
  /* ===================================================== */

  useEffect(() => {
    if (!versions.length) return;
    localStorage.setItem(
      "resume_versions_full",
      JSON.stringify({ versions, activeId })
    );
  }, [versions, activeId]);

  /* ===================================================== */
  /* ================= AUTO SAVE STATUS ================== */
  /* ===================================================== */

  useEffect(() => {
    if (!activeVersion) return;
    setSaveStatus("Saving…");

    const t = setTimeout(() => {
      setSaveStatus("Saved");
      setLastSavedAt(Date.now());
    }, 700);

    return () => clearTimeout(t);
  }, [activeVersion?.data]);

  const getSaveText = () => {
    if (!lastSavedAt) return "Not saved yet";
    const s = Math.floor((Date.now() - lastSavedAt) / 1000);
    if (s < 3) return "Saved just now";
    if (s < 60) return `Saved ${s}s ago`;
    return `Saved ${Math.floor(s / 60)} min ago`;
  };

  /* ===================================================== */
  /* ================= EDIT HANDLERS ===================== */
  /* ===================================================== */

  const updateField = (field, value) => {
    setVersions(prev =>
      prev.map(v =>
        v.id === activeId
          ? {
              ...v,
              history: [...v.history, v.data],
              data: { ...v.data, [field]: value },
            }
          : v
      )
    );
  };

  const undo = () => {
    setVersions(prev =>
      prev.map(v => {
        if (v.id !== activeId || v.history.length === 0) return v;
        const last = v.history[v.history.length - 1];
        return {
          ...v,
          data: last,
          history: v.history.slice(0, -1),
        };
      })
    );
  };

  /* ===================================================== */
  /* ================= VERSION ACTIONS =================== */
  /* ===================================================== */

  const createNewVersion = () => {
    const v = createVersion();
    setVersions([...versions, v]);
    setActiveId(v.id);
  };

  const renameVersion = (id, name) => {
    setVersions(versions.map(v => v.id === id ? { ...v, name } : v));
  };

  const deleteVersion = (id) => {
    if (versions.length === 1) return;
    const filtered = versions.filter(v => v.id !== id);
    setVersions(filtered);
    setActiveId(filtered[0].id);
  };

  /* ===================================================== */
  /* ================= RESUME SCORE ====================== */
  /* ===================================================== */

  const resumeScore = useMemo(() => {
    if (!activeVersion) return 0;
    const d = activeVersion.data;
    let score = 0;
    if (d.summary.length > 30) score += 15;
    if (d.experience.length > 50) score += 25;
    if (d.projects.length > 40) score += 20;
    if (d.education.length > 20) score += 15;
    if (d.skills.length > 10) score += 25;
    return Math.min(score, 100);
  }, [activeVersion]);

  /* ===================================================== */
  /* ================= PDF EXPORT ======================== */
  /* ===================================================== */

  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save("resume.pdf");
  };

  if (!activeVersion) return null;
  const d = activeVersion.data;

  /* ===================================================== */
  /* ================= RENDER ============================ */
  /* ===================================================== */

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-6">Resume Builder</h1>

      {/* ===== Versions ===== */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold">Resume Versions</h2>
          <button className="bg-black text-white px-3 py-1 rounded" onClick={createNewVersion}>
            + New
          </button>
        </div>

        {versions.map(v => (
          <div key={v.id} className="flex justify-between items-center mb-2">
            <input
              value={v.name}
              onChange={e => renameVersion(v.id, e.target.value)}
              className="border rounded px-2 py-1"
            />
            <div className="flex gap-2">
              <button onClick={() => setActiveId(v.id)}>Open</button>
              {versions.length > 1 && (
                <button className="text-red-500" onClick={() => deleteVersion(v.id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ===== Resume Strength ===== */}
      <ResumeStrengthBar score={resumeScore} />

      {/* ===== Edit Mode ===== */}
      {!previewMode && (
        <>
          <button onClick={undo} className="mb-4 underline text-sm">
            Undo last change
          </button>

          <Section title="Contact Details">
            <Grid>
              <Input value={d.email} onChange={v => updateField("email", v)} placeholder="Email" />
              <Input value={d.phone} onChange={v => updateField("phone", v)} placeholder="Phone" />
              <Input value={d.location} onChange={v => updateField("location", v)} placeholder="Location" />
              <Input value={d.linkedin} onChange={v => updateField("linkedin", v)} placeholder="LinkedIn" />
            </Grid>
          </Section>

          <Single title="Name" value={d.name} onChange={v => updateField("name", v)} />
          <Single title="Title" value={d.title} onChange={v => updateField("title", v)} />
          <Textarea title="Summary" value={d.summary} onChange={v => updateField("summary", v)} />
          <Textarea title="Experience" value={d.experience} onChange={v => updateField("experience", v)} />
          <Textarea title="Projects" value={d.projects} onChange={v => updateField("projects", v)} />
          <Textarea title="Education" value={d.education} onChange={v => updateField("education", v)} />
          <Textarea title="Skills" value={d.skills} onChange={v => updateField("skills", v)} />
        </>
      )}

      {/* ===== Preview ===== */}
      {previewMode && (
        <div ref={pdfRef} className="bg-white p-10 text-black">
          <h1 className="text-3xl font-bold text-center">{d.name}</h1>
          <p className="text-center text-gray-600">{d.title}</p>
          <p className="text-center text-sm mt-2">
            {[d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(" • ")}
          </p>

          <Preview title="Summary" content={d.summary} />
          <Preview title="Experience" content={d.experience} />
          <Preview title="Projects" content={d.projects} />
          <Preview title="Education" content={d.education} />
          <Preview title="Skills" content={d.skills} />
        </div>
      )}

      {/* ===== Action Bar ===== */}
      <div className="flex justify-between items-center border-t mt-8 pt-4">
        <span className="text-sm text-gray-500">
          {saveStatus === "Saving…" ? "Saving…" : getSaveText()}
        </span>

        <div className="flex gap-3">
          <button
            className="border px-4 py-2 rounded"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Back to Edit" : "Preview"}
          </button>

          {previewMode && (
            <button
              className="bg-black text-white px-4 py-2 rounded"
              onClick={downloadPDF}
            >
              Download PDF
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

/* ===================================================== */
/* ================== SUB COMPONENTS =================== */
/* ===================================================== */

function ResumeStrengthBar({ score }) {
  return (
    <div className="mb-6">
      <p className="text-sm mb-1">Resume Strength: {score}%</p>
      <div className="w-full h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-black rounded"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div className="bg-white border rounded-xl p-4 mb-4">
    <h3 className="font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
);

const Input = ({ value, onChange, placeholder }) => (
  <input
    className="border rounded p-2"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
  />
);

const Single = ({ title, value, onChange }) => (
  <Section title={title}>
    <Input value={value} onChange={onChange} />
  </Section>
);

const Textarea = ({ title, value, onChange }) => (
  <Section title={title}>
    <textarea
      className="border rounded p-2 w-full min-h-[120px]"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </Section>
);

const Preview = ({ title, content }) => {
  if (!content) return null;
  return (
    <div className="mt-4">
      <h3 className="font-semibold border-b mb-1">{title}</h3>
      <p className="text-sm whitespace-pre-line">{content}</p>
    </div>
  );
};
