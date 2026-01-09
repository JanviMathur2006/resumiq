import { useState, useEffect, useMemo, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ===================================================== */
/* ================= FONT LOADER ======================= */
/* ===================================================== */
const loadFonts = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Roboto:wght@400;500&family=Arial&family=Helvetica&family=Calibri&family=Times+New+Roman&family=Georgia&family=Cambria&family=Garamond&family=Poppins:wght@400;500&family=Montserrat:wght@400;500&family=Source+Sans+Pro:wght@400;600&family=IBM+Plex+Sans:wght@400;500&family=Lato:wght@400;700&family=Open+Sans:wght@400;600&display=swap";
  document.head.appendChild(link);
};
loadFonts();

/* ===================================================== */
/* ================= DEFAULT DATA ====================== */
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
  style: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 1.6,
  },
});

/* ===================================================== */
/* ================= MAIN COMPONENT ==================== */
/* ===================================================== */

export default function ResumeBuilder() {
  const pdfRef = useRef(null);

  /* ---------- Versions ---------- */
  const [versions, setVersions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const activeVersion = versions.find(v => v.id === activeId);

  /* ---------- UI ---------- */
  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [lastSavedAt, setLastSavedAt] = useState(null);

  /* ===================================================== */
  /* ================= LOAD / SAVE ======================= */
  /* ===================================================== */

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("resume_builder_full"));
    if (stored) {
      setVersions(stored.versions);
      setActiveId(stored.activeId);
    } else {
      const initial = createVersion("Default Resume");
      setVersions([initial]);
      setActiveId(initial.id);
    }
  }, []);

  useEffect(() => {
    if (!versions.length) return;
    localStorage.setItem(
      "resume_builder_full",
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
    }, 700);
    return () => clearTimeout(t);
  }, [activeVersion?.data, activeVersion?.style]);

  const getSaveText = () => {
    if (!lastSavedAt) return "Not saved yet";
    const s = Math.floor((Date.now() - lastSavedAt) / 1000);
    if (s < 3) return "Saved just now";
    if (s < 60) return `Saved ${s}s ago`;
    return `Saved ${Math.floor(s / 60)} min ago`;
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
              history: [...v.history, v.data],
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
          ? { ...v, style: { ...v.style, [key]: value } }
          : v
      )
    );
  };

  const undo = () => {
    setVersions(prev =>
      prev.map(v => {
        if (v.id !== activeId || !v.history.length) return v;
        const last = v.history[v.history.length - 1];
        return { ...v, data: last, history: v.history.slice(0, -1) };
      })
    );
  };

  /* ===================================================== */
  /* ================= VERSION MGMT ====================== */
  /* ===================================================== */

  const addVersion = () => {
    const v = createVersion();
    setVersions([...versions, v]);
    setActiveId(v.id);
  };

  const renameVersion = (id, name) => {
    setVersions(versions.map(v => (v.id === id ? { ...v, name } : v)));
  };

  const deleteVersion = id => {
    if (versions.length === 1) return;
    const filtered = versions.filter(v => v.id !== id);
    setVersions(filtered);
    setActiveId(filtered[0].id);
  };

  /* ===================================================== */
  /* ================= RESUME SCORE ====================== */
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
    <div className="max-w-5xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-6">Resume Builder</h1>

      {/* Versions */}
      <Box>
        <Row between>
          <strong>Resume Versions</strong>
          <button onClick={addVersion}>+ New</button>
        </Row>
        {versions.map(v => (
          <Row key={v.id} between>
            <input value={v.name} onChange={e => renameVersion(v.id, e.target.value)} />
            <div>
              <button onClick={() => setActiveId(v.id)}>Open</button>
              {versions.length > 1 && (
                <button onClick={() => deleteVersion(v.id)} style={{ color: "red" }}>
                  Delete
                </button>
              )}
            </div>
          </Row>
        ))}
      </Box>

      {/* Strength */}
      <div className="mb-6">
        <p>Resume Strength: {score}%</p>
        <div style={{ background: "#e5e7eb", height: 6 }}>
          <div style={{ width: `${score}%`, background: "black", height: 6 }} />
        </div>
      </div>

      {/* Typography */}
      <Box>
        <strong>Typography</strong>
        <Row>
          <select value={s.fontFamily} onChange={e => updateStyle("fontFamily", e.target.value)}>
            {[
              "Inter","Arial","Helvetica","Roboto","Calibri",
              "Times New Roman","Georgia","Cambria","Garamond",
              "Poppins","Montserrat","Source Sans Pro","IBM Plex Sans","Lato","Open Sans"
            ].map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <select value={s.fontSize} onChange={e => updateStyle("fontSize", Number(e.target.value))}>
            {[11,12,13,14,15,16,17,18].map(n => (
              <option key={n} value={n}>{n}px</option>
            ))}
          </select>
        </Row>
      </Box>

      {/* Edit */}
      {!previewMode && (
        <>
          <button onClick={undo}>Undo</button>
          {Object.keys(EMPTY_RESUME).map(k => (
            <Box key={k}>
              <strong>{k.toUpperCase()}</strong>
              <textarea
                value={d[k]}
                onChange={e => updateField(k, e.target.value)}
                rows={k === "summary" ? 3 : 4}
              />
            </Box>
          ))}
        </>
      )}

      {/* Preview */}
      {previewMode && (
        <div
          ref={pdfRef}
          style={{
            fontFamily: s.fontFamily,
            fontSize: s.fontSize,
            lineHeight: s.lineHeight,
            background: "white",
            padding: 40,
          }}
        >
          <h1>{d.name}</h1>
          <p>{d.title}</p>
          <p>{[d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(" • ")}</p>
          {Object.entries(d).map(([k, v]) => v && k !== "name" && k !== "title" && (
            <section key={k}>
              <h3>{k.toUpperCase()}</h3>
              <p>{v}</p>
            </section>
          ))}
        </div>
      )}

      {/* Actions */}
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
