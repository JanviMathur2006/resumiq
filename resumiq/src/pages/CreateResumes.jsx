import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { resumeTypes } from "../data/resumeTypes";

/* =====================================================
   USER MODES
===================================================== */
const USER_MODE = {
  EMPTY: "EMPTY",
  GUIDED: "GUIDED",
  POWER: "POWER",
};

/* =====================================================
   TABS
===================================================== */
const TABS = [
  { id: "recommended", label: "Recommended" },
  { id: "students", label: "Students" },
  { id: "professionals", label: "Professionals" },
  { id: "specialized", label: "Specialized" },
];

/* =====================================================
   ANIMATIONS
===================================================== */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function CreateResumes() {
  const navigate = useNavigate();
  const undoTimer = useRef(null);

  /* =====================================================
     STATE
  ===================================================== */
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedType, setSelectedType] = useState(null);
  const [previousType, setPreviousType] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userMode, setUserMode] = useState(USER_MODE.EMPTY);

  /* =====================================================
     USER MODE
  ===================================================== */
  useEffect(() => {
    const count = Number(
      localStorage.getItem("resumiq_resume_count") || 0
    );

    if (count === 0) setUserMode(USER_MODE.EMPTY);
    else if (count <= 2) setUserMode(USER_MODE.GUIDED);
    else setUserMode(USER_MODE.POWER);
  }, []);

  /* =====================================================
     LOADING
  ===================================================== */
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  /* =====================================================
     BACK SHORTCUT
  ===================================================== */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.altKey) && e.key === "ArrowLeft") {
        e.preventDefault();
        navigate(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  /* =====================================================
     FILTER
  ===================================================== */
  const filteredTypes = resumeTypes.filter((t) =>
    t.category.includes(activeTab)
  );

  /* =====================================================
     SELECT WITH UNDO
  ===================================================== */
  const handleSelect = (type) => {
    if (selectedType?.id === type.id) return;

    setPreviousType(selectedType);
    setSelectedType(type);
    setShowUndo(true);

    clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setShowUndo(false), 4000);
  };

  const handleUndo = () => {
    setSelectedType(previousType);
    setShowUndo(false);
  };

  /* =====================================================
     CONTINUE
  ===================================================== */
  const handleContinue = () => {
    if (!selectedType) return;

    const count = Number(
      localStorage.getItem("resumiq_resume_count") || 0
    );
    localStorage.setItem("resumiq_resume_count", count + 1);

    navigate("/app/builder", {
      state: {
        resumeType: selectedType.id,
        sections: selectedType.sections,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb]">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="fixed top-28 left-6 text-gray-400 hover:text-gray-900 transition"
      >
        ←
      </button>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* INFO BOX */}
        {userMode === USER_MODE.EMPTY && (
          <div className="mb-10 rounded-2xl border bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Create your first resume
            </h2>
            <p className="mt-1 text-gray-600">
              We’ll guide you step by step. You can edit everything later.
            </p>
          </div>
        )}

        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-gray-900">
          Choose Resume Type
        </h1>
        <p className="mt-2 text-gray-500">
          Select the resume format that best fits your profile
        </p>

        {/* ✅ FIXED TABS (LIGHT PILLS) */}
        <div className="mt-8 flex gap-3 flex-wrap">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition
                  ${
                    active
                      ? "bg-white text-gray-900 border border-gray-300 shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border bg-white p-6 animate-pulse"
              >
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-4" />
                <div className="h-3 w-full bg-gray-200 rounded mb-2" />
                <div className="h-3 w-5/6 bg-gray-200 rounded mb-6" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTypes.map((type) => {
              const active = selectedType?.id === type.id;

              return (
                <motion.div
                  key={type.id}
                  variants={item}
                  onClick={() => handleSelect(type)}
                  className={`
                    cursor-pointer rounded-2xl border p-6 transition-all
                    ${
                      active
                        ? "border-black bg-white shadow-[0_0_0_3px_rgba(0,0,0,0.08)]"
                        : "border-gray-200 bg-white hover:-translate-y-1 hover:shadow-md"
                    }
                  `}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {type.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {type.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {type.bestFor.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* CONTINUE */}
        <div className="mt-12 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedType}
            className={`
              rounded-xl px-6 py-3 text-sm font-medium transition
              ${
                selectedType
                  ? "bg-black text-white hover:bg-gray-900"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Continue →
          </button>
        </div>
      </div>

      {/* UNDO */}
      <AnimatePresence>
        {showUndo && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm flex gap-3"
          >
            Resume type changed
            <button onClick={handleUndo} className="underline">
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
