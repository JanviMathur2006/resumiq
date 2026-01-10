import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import { resumeTypes } from "../data/resumeTypes";

const tabs = [
  { id: "recommended", label: "Recommended" },
  { id: "students", label: "Students" },
  { id: "professionals", label: "Professionals" },
  { id: "specialized", label: "Specialized" },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export default function CreateResumes() {
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();

  const filteredResumes = resumeTypes.filter((type) =>
    type.category.includes(activeTab)
  );

  const handleContinue = () => {
    if (!selectedType) return;
    navigate("/app/builder", {
      state: { resumeType: selectedType },
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f6f7fb]">
        <div className="max-w-6xl mx-auto px-6 py-12">

          {/* Heading */}
          <h1 className="text-3xl font-semibold text-gray-900">
            Choose Resume Type
          </h1>
          <p className="mt-2 text-gray-500">
            Select the resume format that best fits your profile
          </p>

          {/* Tabs */}
          <div className="mt-8 flex gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                  ${
                    activeTab === tab.id
                      ? "bg-black text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Resume Cards */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredResumes.map((type) => {
              const isActive = selectedType?.id === type.id;

              return (
                <motion.div
                  key={type.id}
                  variants={item}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedType(type)}
                  className={`
                    relative cursor-pointer rounded-2xl border bg-white p-6
                    transition-all duration-200
                    ${
                      isActive
                        ? "border-black shadow-lg"
                        : "border-gray-200 hover:shadow-md"
                    }
                  `}
                >
                  {/* Recommended badge */}
                  {type.recommended && (
                    <span className="absolute top-4 right-4 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                      Recommended
                    </span>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {type.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    {type.description}
                  </p>

                  <p className="text-xs text-gray-400">
                    Best for: {type.bestFor}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Continue Button */}
          <div className="mt-12 flex justify-end">
            <motion.button
              whileHover={selectedType ? { scale: 1.03 } : {}}
              whileTap={selectedType ? { scale: 0.96 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              disabled={!selectedType}
              onClick={handleContinue}
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
            </motion.button>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
