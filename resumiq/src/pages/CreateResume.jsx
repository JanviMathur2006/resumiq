import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TABS = ["Recommended", "Students", "Professionals", "Specialized"];

const RESUME_TYPES = [
  {
    id: "fresher",
    title: "Fresher / Student Resume",
    description: "Best for students and fresh graduates",
    bestFor: "Students, freshers",
    tab: "Students",
  },
  {
    id: "professional",
    title: "Experienced Professional Resume",
    description: "For professionals with work experience",
    bestFor: "1–15 years experience",
    tab: "Professionals",
  },
  {
    id: "internship",
    title: "Internship Resume",
    description: "Apply confidently for internships",
    bestFor: "Internships",
    tab: "Students",
  },
  {
    id: "careerSwitch",
    title: "Career Switch Resume",
    description: "Transition into a new career path",
    bestFor: "Career changers",
    tab: "Specialized",
  },
];

export default function CreateResume() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Recommended");

  const filteredResumes =
    activeTab === "Recommended"
      ? RESUME_TYPES
      : RESUME_TYPES.filter((r) => r.tab === activeTab);

  const handleSelect = (resumeType) => {
    localStorage.setItem("resumeType", resumeType.id);
    navigate("/resume-builder");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8">
        Create a Resume
      </h1>

      {/* TABS */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium
              ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* RESUME TYPE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResumes.map((resume) => (
          <motion.div
            key={resume.id}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onClick={() => handleSelect(resume)}
            className="bg-white rounded-2xl p-6 cursor-pointer
                       border hover:shadow-xl"
          >
            <h2 className="text-xl font-bold mb-2">
              {resume.title}
            </h2>

            <p className="text-gray-600 mb-3">
              {resume.description}
            </p>

            <p className="text-sm text-gray-500 mb-6">
              <span className="font-medium text-gray-700">
                Best for:
              </span>{" "}
              {resume.bestFor}
            </p>

            <div className="inline-block px-4 py-2 rounded-lg
                            bg-black text-white text-sm font-medium">
              Use this resume →
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
