import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { resumeTypes } from "../data/resumeTypes";

/* =======================
   TABS
======================= */
const TABS = [
  { id: "recommended", label: "Recommended" },
  { id: "students", label: "Students" },
  { id: "professionals", label: "Professionals" },
  { id: "specialized", label: "Specialized" },
];

/* =======================
   ANIMATIONS
======================= */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function CreateResumes() {
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedType, setSelectedType] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const navigate = useNavigate();

  /* =======================
     SMART RECOMMENDATION
  ======================= */
  const recommendedId = "fresher"; // must match resumeTypes id

  /* =======================
     FIRST-TIME VISIT CHECK
  ======================= */
  useEffect(() => {
    const visited = sessionStorage.getItem("resumiq_create_seen");
    if (!visited) {
      setIsFirstVisit(true);
      sessionStorage.setItem("resumiq_create_seen", "true");
    }
  }, []);

  /* =======================
     BACK SHORTCUT
  ======================= */
  useEffect(() => {
    const handleBack = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if ((e.metaKey || e.altKey) && e.key === "ArrowLeft") {
        e.preventDefault();
        navigate(-1);
      }
    };

    window.addEventListener("keydown", handleBack);
    return () => window.removeEventListener("keydown", handleBack);
  }, [navigate]);

  const filteredTypes = resumeTypes.filter((type) =>
    type.category.includes(activeTab)
  );

  const handleContinue = () => {
    if (!selectedType) return;
    navigate("/app/builder", {
      state: {
        resumeType: selectedType.id,
        sections: selectedType.sections,
      },
    });
  };

  /* =======================
     KEYBOARD NAVIGATION
  ======================= */
  useEffect(() => {
    const handleKeys = (e) => {
      if (!filteredTypes.length) return;

      const index = filteredTypes.findIndex(
        (t) => t.id === selectedType?.id
      );

      if (e.key === "ArrowRight") {
        const next = filteredTypes[index + 1] || filteredTypes[0];
        setSelectedType(next);
      }

      if (e.key === "ArrowLeft") {
        const prev =
          filteredTypes[index - 1] ||
          filteredTypes[filteredTypes.length - 1];
        setSelectedType(prev);
      }

      if (e.key === "Enter" && selectedType) {
        handleContinue();
      }
    };

    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [filteredTypes, selectedType]);

  return (
    <div className="min-h-screen bg-[#f6f7fb]">

      {/* BACK ARROW */}
      <button
        onClick={() => navigate(-1)}
        className="
          fixed top-28 left-6 z-20
          text-gray-400 text-xl
          bg-transparent rounded-none
          hover:text-gray-900
          transition-all hover:-translate-x-1
        "
      >
        ←
      </button>

      {/* PAGE WRAPPER – ONE-TIME ENTRANCE */}
      <motion.div
        initial={isFirstVisit ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-6 py-12"
      >

        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-gray-900">
          Choose Resume Type
        </h1>
        <p className="mt-2 text-gray-500">
          Select the resume format that best fits your profile
        </p>

        {/* TABS */}
        <div className="relative mt-8 border-b border-gray-200">
          <div className="flex gap-8">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative pb-3 text-sm font-medium
                    bg-transparent rounded-none transition-colors
                    ${
                      isActive
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  {tab.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeTab"
                      className="
                        absolute left-0 right-0 -bottom-[1px]
                        h-[2px] bg-gray-900
                      "
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RECOMMENDED MICRO COPY */}
        {activeTab === "recommended" && (
          <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
            <span>⭐</span>
            <span>Recommended for you based on common student profiles</span>
          </div>
        )}

        {/* CONTENT */}
        {filteredTypes.length === 0 ? (
          <div className="mt-20 text-center text-gray-500">
            <p className="text-lg font-medium">No resume types found</p>
            <p className="mt-1 text-sm">
              Try switching to a different category
            </p>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTypes.map((type) => {
              const isActive = selectedType?.id === type.id;
              const isRecommended =
                activeTab === "recommended" && type.id === recommendedId;

              return (
                <motion.div
                  key={type.id}
                  variants={item}
                  onClick={() => setSelectedType(type)}
                  initial={
                    isFirstVisit && isRecommended
                      ? { scale: 0.96 }
                      : false
                  }
                  animate={
                    isFirstVisit && isRecommended
                      ? { scale: [0.96, 1.02, 1] }
                      : false
                  }
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`
                    group relative cursor-pointer rounded-2xl border p-6
                    transition-all duration-200
                    ${
                      isActive
                        ? "border-black bg-[#fafafa] shadow-[0_0_0_3px_rgba(0,0,0,0.08)]"
                        : isRecommended
                        ? "border-gray-300 bg-white shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
                        : "border-gray-200 bg-white hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md"
                    }
                  `}
                >
                  {isRecommended && (
                    <span className="inline-block mb-2 text-xs font-medium text-gray-500">
                      ⭐ Recommended
                    </span>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {type.name}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {type.description}
                  </p>

                  <div className="relative h-px w-full overflow-hidden mb-4">
                    <span
                      className={`
                        absolute left-0 top-0 h-px bg-gray-300 transition-all duration-300
                        ${
                          isActive || isRecommended
                            ? "w-full opacity-30"
                            : "w-0 opacity-20 group-hover:w-full"
                        }
                      `}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {type.bestFor.split(",").map((item) => (
                      <span
                        key={item}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                      >
                        {item.trim()}
                      </span>
                    ))}
                  </div>

                  <span
                    className="
                      pointer-events-none absolute bottom-4 right-4
                      text-gray-400 text-lg
                      opacity-0 translate-x-1
                      transition-all duration-200
                      group-hover:opacity-100 group-hover:translate-x-0
                    "
                  >
                    →
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* CONTINUE */}
        <div className="mt-12 flex justify-end">
          <div className="text-right">
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

            <p className="mt-2 text-xs text-gray-400">
              Tip: Use ← → to navigate, Enter to continue
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
