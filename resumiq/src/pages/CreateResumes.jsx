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
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  /* =======================
     SMART RECOMMENDATION
  ======================= */
  const recommendedId = "fresher";

  /* =======================
     FIRST-TIME VISIT
  ======================= */
  useEffect(() => {
    const visited = sessionStorage.getItem("resumiq_create_seen");
    if (!visited) {
      setIsFirstVisit(true);
      sessionStorage.setItem("resumiq_create_seen", "true");
    }
  }, []);

  /* =======================
     FAKE LOADING (SKELETON)
  ======================= */
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [activeTab]);

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
     KEYBOARD NAV
  ======================= */
  useEffect(() => {
    if (isLoading) return;

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
  }, [filteredTypes, selectedType, isLoading]);

  return (
    <div className="min-h-screen bg-[#f6f7fb]">

      {/* BACK */}
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

      {/* PAGE WRAPPER */}
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
                      className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-gray-900"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RECOMMENDED TEXT */}
        {activeTab === "recommended" && (
          <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
            ⭐ Recommended for you based on common student profiles
          </div>
        )}

        {/* =======================
            CONTENT
        ======================= */}

        {/* SKELETON STATE */}
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
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTypes.length === 0 ? (
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

                  <p className="text-sm text-gray-600 mb-4">
                    {type.description}
                  </p>

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

      </motion.div>
    </div>
  );
}

