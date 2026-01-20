import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import BuilderTransition from "../components/BuilderTransition";

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

const createVersion = (name = "New Resume", data = EMPTY_RESUME) => ({
  id: "v_" + Date.now(),
  name,
  deletedAt: null,
  data: { ...data },
  style: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 1.6,
    margin: 40,
  },
  history: [],
});

/* ===================================================== */
/* ================= MAIN COMPONENT ==================== */
/* ===================================================== */

export default function ResumeBuilder() {
  const pdfRef = useRef(null);
  const { state } = useLocation();
  const resumeType = state?.resumeType || "student";

  /* ---------------- Versions ---------------- */
  const [versions, setVersions] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const activeVersion = versions.find(v => v.id === activeId);
  const activeVersions = versions.filter(v => !v.deletedAt);
  const deletedVersions = versions.filter(v => v.deletedAt);

  /* ---------------- UI ---------------- */
  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [lastSavedAt, setLastSavedAt] = useState(null);

  /* ===================================================== */
  /* ================= INITIAL LOAD ===================== */
  /* ===================================================== */

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("resumiq_builder_full"));
    if (stored) {
      setVersions(stored.versions);
      setActiveId(stored.activeId);
      return;
    }

    let initialData = { ...EMPTY_RESUME };

    if (resumeType === "student" || resumeType === "internship") {
      initialData.title = "Student / Fresher";
    }
    if (resumeType === "professional") {
      initialData.title = "Experienced Professional";
    }
    if (resumeType === "career") {
      initialData.title = "Career Transition Candidate";
    }

    const initial = createVersion("Primary Resume", initialData);
    setVersions([initial]);
    setActiveId(initial.id);
  }, [resumeType]);

  /* ===================================================== */
  /* ================= SAVE ============================== */
  /* ===================================================== */

  useEffect(() => {
    if (!versions.length) return;
    localStorage.setItem(
      "resumiq_builder_full",
      JSON.stringify({ versions, activeId })
    );
  }, [versions, activeId]);

  /* ===================================================== */
  /* ================= AUTOSAVE ========================== */
  /* ===================================================== */

  useEffect(() => {
    if (!activeVersion) return;
    setSaveStatus("Saving…");

    const t = setTimeout(() => {
      setSaveStatus("Saved");
      setLastSavedAt(Date.now());
    }, 600);

    return () => clearTimeout(t);
  }, [activeVersion?.data, activeVersion?.style]);

  const getSaveText = () => {
    if (!lastSavedAt) return "Not saved yet";
    const sec = Math.floor((Date.now() - lastSavedAt) / 1000);
    if (sec < 3) return "Saved just now";
    if (sec < 60) return `Saved ${sec}s ago`;
    return `Saved ${Math.floor(sec / 60)} min ago`;
  };

  /* ===================================================== */
  /* ================= EDIT LOGIC ======================== */
  /* ===================================================== */

  const updateField = (field, value) => {
    setVersions(prev =>
      prev.map(v =>
        v.id === activeId
          ? {
              ...v,
              history: [
                ...v.history,
                {
                  time: Date.now(),
                  action: `Edited ${field}`,
                  dataSnapshot: v.data,
                  styleSnapshot: v.style,
                },
              ],
              data: { ...v.data, [field]: value },
            }
          : v
      )
    );
  };

  const updateStyle = (key, value) => {
    setVersions(prev =>
      prev.map(v =>
        v.id === activeId
          ? {
              ...v,
              history: [
                ...v.history,
                {
                  time: Date.now(),
                  action: `Changed ${key}`,
                  dataSnapshot: v.data,
                  styleSnapshot: v.style,
                },
              ],
              style: { ...v.style, [key]: value },
            }
          : v
      )
    );
  };

  const undo = () => {
    setVersions(prev =>
      prev.map(v => {
        if (v.id !== activeId || !v.history.length) return v;
        const last = v.history[v.history.length - 1];
        return {
          ...v,
          data: last.dataSnapshot,
          style: last.styleSnapshot,
          history: v.history.slice(0, -1),
        };
      })
    );
  };

  /* ===================================================== */
  /* ================= VERSION MGMT ====================== */
  /* ===================================================== */

  const addVersion = () => {
    const v = createVersion("New Resume");
    setVersions([...versions, v]);
    setActiveId(v.id);
  };

  const renameVersion = (id, name) => {
    setVersions(versions.map(v => (v.id === id ? { ...v, name } : v)));
  };

  const softDeleteVersion = id => {
    setVersions(versions.map(v =>
      v.id === id ? { ...v, deletedAt: Date.now() } : v
    ));
    if (id === activeId) {
      const remaining = activeVersions.filter(v => v.id !== id);
      setActiveId(remaining.length ? remaining[0].id : null);
    }
  };

  const restoreVersion = id => {
    setVersions(versions.map(v =>
      v.id === id ? { ...v, deletedAt: null } : v
    ));
  };

  const deleteForever = id => {
    setVersions(versions.filter(v => v.id !== id));
  };

  /* ===================================================== */
  /* ================= SCORE ============================= */
  /* ===================================================== */

  const score = useMemo(() => {
    if (!activeVersion) return 0;
    const d = activeVersion.data;
    let s = 0;
    if (d.summary.length > 30) s += 15;
    if (d.experience.length > 50) s += 25;
    if (d.projects.length > 40) s += 20;
    if (d.education.length > 20) s += 15;
    if (d.skills.length > 10) s += 25;
    return Math.min(s, 100);
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
  const s = activeVersion.style;

  /* ===================================================== */
  /* ================= RENDER ============================ */
  /* ===================================================== */

  return (
    <BuilderTransition>
      <div className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold mb-6">
          Resume Builder
          <span className="ml-3 text-sm text-gray-500">
            ({resumeType})
          </span>
        </h1>

        {/* ===== Versions ===== */}
        <Box>
          <Row between>
            <strong>Resume Versions</strong>
            <button onClick={addVersion}>+ New</button>
          </Row>

          {activeVersions.map(v => (
            <Row key={v.id} between>
              <input
                value={v.name}
                onChange={e => renameVersion(v.id, e.target.value)}
              />
              <div>
                <button onClick={() => setActiveId(v.id)}>Open</button>
                <button onClick={() => softDeleteVersion(v.id)} style={{ color: "red" }}>
                  Delete
                </button>
              </div>
            </Row>
          ))}
        </Box>

        {/* ===== Trash ===== */}
        {deletedVersions.length > 0 && (
          <Box>
            <strong>Trash</strong>
            {deletedVersions.map(v => (
              <Row key={v.id} between>
                <span>{v.name}</span>
                <div>
                  <button onClick={() => restoreVersion(v.id)}>Restore</button>
                  <button onClick={() => deleteForever(v.id)} style={{ color: "red" }}>
                    Delete Forever
                  </button>
                </div>
              </Row>
            ))}
          </Box>
        )}

        {/* ===== Score ===== */}
        <div className="mb-6">
          <p>Resume Strength: {score}%</p>
          <div style={{ height: 6, background: "#e5e7eb" }}>
            <div style={{ width: `${score}%`, height: 6, background: "black" }} />
          </div>
        </div>

        {/* ===== Editor ===== */}
        {!previewMode && (
          <>
            <button onClick={undo}>Undo</button>
            {Object.keys(EMPTY_RESUME).map(key => (
              <Box key={key}>
                <strong>{key.toUpperCase()}</strong>
                <textarea
                  rows={4}
                  value={d[key]}
                  onChange={e => updateField(key, e.target.value)}
                />
              </Box>
            ))}
          </>
        )}

        {/* ===== Preview ===== */}
        {previewMode && (
          <div
            ref={pdfRef}
            style={{
              fontFamily: s.fontFamily,
              fontSize: s.fontSize,
              lineHeight: s.lineHeight,
              padding: s.margin,
              background: "white",
            }}
          >
            <h1>{d.name}</h1>
            <p>{d.title}</p>
            <p>{[d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(" • ")}</p>

            {Object.entries(d).map(([k, v]) =>
              v && !["name","title","email","phone","location","linkedin"].includes(k) && (
                <section key={k}>
                  <h3>{k.toUpperCase()}</h3>
                  <p>{v}</p>
                </section>
              )
            )}
          </div>
        )}

        {/* ===== Actions ===== */}
        <Row between>
          <small>{saveStatus === "Saving…" ? "Saving…" : getSaveText()}</small>
          <div>
            <button onClick={() => setPreviewMode(!previewMode)}>
              {previewMode ? "Edit" : "Preview"}
            </button>
            {previewMode && <button onClick={downloadPDF}>Download PDF</button>}
          </div>
        </Row>

      </div>
    </BuilderTransition>
  );
}

/* ===================================================== */
/* ================= UI HELPERS ======================== */
/* ===================================================== */

const Box = ({ children }) => (
  <div style={{ border: "1px solid #e5e7eb", padding: 16, marginBottom: 16 }}>
    {children}
  </div>
);

const Row = ({ children, between }) => (
  <div
    style={{
      display: "flex",
      justifyContent: between ? "space-between" : "flex-start",
      gap: 12,
      marginBottom: 8,
    }}
  >
    {children}
  </div>
);
