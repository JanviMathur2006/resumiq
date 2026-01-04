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
    transition: { duration: 0.3 },
  },
};

export default function CreateResumes() {
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();

  const filteredResumes = resumeTypes.filter((r) =>
    r.category.includes(activeTab)
  );

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Choose Resume Type</h1>
        <p className="text-gray-500 mb-6">
          Select the resume format that best fits your profile
        </p>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredResumes.map((type) => {
            const selected = selectedType?.id === type.id;

            return (
              <motion.div
                key={type.id}
                variants={item}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedType(type)}
                className={`rounded-2xl border p-6 cursor-pointer
                  ${
                    selected
                      ? "border-black shadow-lg"
                      : "border-gray-200 hover:shadow-md"
                  }`}
              >
                <h3 className="text-lg font-semibold mb-2">
                  {type.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {type.description}
                </p>
                <p className="text-xs text-gray-500">
                  Best for: {type.bestFor}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Continue */}
        <div className="mt-10 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            disabled={!selectedType}
            onClick={() =>
              navigate("/app/builder", {
                state: { resumeType: selectedType },
              })
            }
            className={`px-6 py-3 rounded-lg font-medium
              ${
                selectedType
                  ? "bg-black text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            Continue →
          </motion.button>
        </div>
      </div>
    </PageTransition>
  );
}
