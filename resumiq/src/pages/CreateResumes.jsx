import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { resumeTypes } from "../data/resumeTypes";

/* =====================================================
   USER MODES — POINT 13
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
     DETERMINE USER MODE (POINT 13)
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
     LOADING STATE (POINT 9)
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
     FILTER TYPES
  ===================================================== */
  const filteredTypes = resumeTypes.filter((t) =>
    t.category.includes(activeTab)
  );

  /* =====================================================
     SELECT WITH UNDO (POINT 10)
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

  /* =====================================================
     KEYBOARD NAV (POWER USERS)
  ===================================================== */
  useEffect(() => {
    if (userMode !== USER_MODE.POWER) return;

    const handler = (e) => {
      if (!filteredTypes.length) return;

      const index = filteredTypes.findIndex(
        (t) => t.id === selectedType?.id
      );

      if (e.key === "ArrowRight") {
        setSelectedType(
          filteredTypes[index + 1] || filteredTypes[0]
        );
      }

      if (e.key === "ArrowLeft") {
        setSelectedType(
          filteredTypes[index - 1] ||
            filteredTypes[filteredTypes.length - 1]
        );
      }

      if (e.key === "Enter" && selectedType) {
        handleContinue();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filteredTypes, selectedType, userMode]);

  return (
    <div className="min-h-screen bg-[#f6f7fb]">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="
          fixed top-28 left-6
          text-gray-400 hover:text-gray-900
          transition
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-2
        "
      >
        ←
      </button>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* POINT 13 STATES */}
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

        {userMode === USER_MODE.GUIDED && (
          <div className="mb-10 rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recommended for you
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Based on your previous resumes, these options work best.
            </p>
          </div>
        )}

        {userMode === USER_MODE.POWER && (
          <div className="mb-10 text-sm text-gray-500">
            Tip: Use ← → arrows and Enter to move faster
          </div>
        )}

        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-gray-900">
          Choose Resume Type
        </h1>
        <p className="mt-2 text-gray-500">
          Select the resume format that best fits your profile
        </p>

        {/* TABS */}
        <div className="relative mt-8 border-b border-gray-200">
          <div className="flex gap-8" role="tablist">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative pb-3 text-sm font-medium
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    ${
                      active
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-gray-900"
                    />
                  )}
                </button>
              );
            })}
          </div>
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
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  aria-label={`Select ${type.name}`}
                  onClick={() => handleSelect(type)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSelect(type);
                  }}
                  className={`
                    cursor-pointer rounded-2xl border p-6 transition-all
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
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
            aria-disabled={!selectedType}
            className={`
              rounded-xl px-6 py-3 text-sm font-medium
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
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

      {/* UNDO TOAST */}
      <AnimatePresence>
        {showUndo && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="
              fixed bottom-6 left-1/2 -translate-x-1/2
              bg-gray-900 text-white px-4 py-2 rounded-lg text-sm
              flex gap-3
            "
          >
            Resume type changed
            <button
              onClick={handleUndo}
              className="underline focus-visible:outline"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
