import { useState } from "react";
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
   ENTRANCE ANIMATION
======================= */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
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
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* BACK ARROW */}
        <button
          onClick={() => navigate(-1)}
          className="
            mb-6 inline-flex items-center gap-2
            text-sm font-medium text-gray-500
            hover:text-gray-900 transition
          "
        >
          <span className="text-lg transition-transform hover:-translate-x-0.5">
            ←
          </span>
          Back
        </button>

        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-gray-900">
          Choose Resume Type
        </h1>
        <p className="mt-2 text-gray-500">
          Select the resume format that best fits your profile
        </p>

        {/* TABS */}
        <div className="mt-8 flex gap-3 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* RESUME CARDS */}
        <motion.div
          key={activeTab}
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTypes.map((type) => {
            const isActive = selectedType?.id === type.id;

            return (
              <motion.div
                key={type.id}
                variants={item}
                onClick={() => setSelectedType(type)}
                className={`
                  group relative cursor-pointer rounded-2xl border p-6
                  transition-all duration-200
                  ${
                    isActive
                      ? `
                        border-black bg-[#fafafa]
                        shadow-[0_0_0_3px_rgba(0,0,0,0.08)]
                      `
                      : `
                        border-gray-200 bg-white
                        hover:shadow-md hover:-translate-y-1
                      `
                  }
                `}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.name}
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  {type.description}
                </p>

                {/* SUBTLE DIVIDER */}
                <div className="relative h-px w-full overflow-hidden mb-4">
                  <span
                    className={`
                      absolute left-0 top-0 h-px bg-gray-300
                      transition-all duration-300
                      ${
                        isActive
                          ? "w-full opacity-30"
                          : "w-0 opacity-20 group-hover:w-full"
                      }
                    `}
                  />
                </div>

                <p className="text-xs text-gray-400">
                  Best for: {type.bestFor}
                </p>

                {/* HOVER ARROW */}
                <span
                  className="
                    pointer-events-none absolute bottom-4 right-4
                    text-gray-400 text-lg
                    opacity-0 translate-x-1
                    transition-all duration-200
                    group-hover:opacity-100
                    group-hover:translate-x-0
                  "
                >
                  →
                </span>
              </motion.div>
            );
          })}
        </motion.div>

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
    </div>
  );
}
