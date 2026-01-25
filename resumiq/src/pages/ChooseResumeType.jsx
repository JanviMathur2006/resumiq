import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const TABS = ["Recommended", "Students", "Professionals", "Specialized"];

const RESUMES = [
  {
    id: "student",
    title: "Fresher / Student Resume",
    description: "Best for students and fresh graduates",
    highlights: ["One-page professional layout", "Skills-first structure"],
    bestFor: "Students, freshers",
    tab: "Students",
    recommended: true,
  },
  {
    id: "professional",
    title: "Experienced Professional Resume",
    description: "For professionals with work experience",
    highlights: ["Experience-focused sections", "Recruiter-friendly format"],
    bestFor: "1–15 years experience",
    tab: "Professionals",
  },
  {
    id: "internship",
    title: "Internship Resume",
    description: "Apply confidently for internships",
    highlights: ["Project-centric layout", "Clear academic focus"],
    bestFor: "Internships",
    tab: "Students",
  },
  {
    id: "career",
    title: "Career Switch Resume",
    description: "Transition into a new career path",
    highlights: ["Transferable skills emphasis", "Clear career narrative"],
    bestFor: "Career changers",
    tab: "Specialized",
  },
];

/* =======================
   ANIMATIONS
======================= */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export default function ChooseResumeType() {
  const [activeTab, setActiveTab] = useState("Recommended");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const filteredResumes =
    activeTab === "Recommended"
      ? RESUMES
      : RESUMES.filter(r => r.tab === activeTab);

  /* Enter → Continue */
  useEffect(() => {
    const handleKey = e => {
      if (e.key === "Enter" && selected) {
        navigate("/app/builder", { state: { resumeType: selected } });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-[#F7F9FC] px-12 py-10"
    >
      {/* Header */}
      <h1 className="text-3xl font-semibold text-[#0A1A33]">
        Choose Resume Type
      </h1>
      <p className="text-gray-500 mt-1">
        Select the resume format that best fits your profile
      </p>

      {/* Tabs */}
      <div className="flex gap-3 mt-8">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition
              ${
                activeTab === tab
                  ? "bg-[#0A1A33] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        key={activeTab}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-6xl"
      >
        {filteredResumes.map(card => {
          const isSelected = selected === card.id;

          return (
            <motion.div
              key={card.id}
              variants={item}
              whileHover={!isSelected ? { y: -3 } : {}}
              animate={isSelected ? { scale: [1, 0.97, 1] } : { scale: 1 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={() => setSelected(card.id)}
              className={`relative cursor-pointer rounded-2xl bg-white border transition
                ${
                  isSelected
                    ? "border-[#0A1A33] shadow-lg"
                    : "border-gray-200 hover:shadow-md"
                }`}
            >
              {/* Accent bar */}
              <div
                className={`absolute left-0 top-0 h-full rounded-l-2xl ${
                  isSelected ? "bg-[#0A1A33]" : "bg-[#0A1A33]/60"
                }`}
                style={{ width: "3px" }}
              />

              {/* Checkmark */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#0A1A33] text-white flex items-center justify-center text-sm"
                  >
                    ✓
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content */}
              <div className="p-6 pl-7">
                {card.recommended && (
                  <span className="inline-block text-xs font-medium text-[#0A1A33] border border-[#0A1A33]/30 px-2 py-0.5 rounded-full mb-3">
                    Best Match
                  </span>
                )}

                <h3 className="text-lg font-semibold text-[#0A1A33]">
                  {card.title}
                </h3>

                <p className="text-gray-600 text-sm mt-1">
                  {card.description}
                </p>

                <ul className="mt-4 space-y-1 text-sm text-gray-600">
                  {card.highlights.map(h => (
                    <li key={h}>• {h}</li>
                  ))}
                </ul>

                <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  Best for: {card.bestFor}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Continue */}
      <div className="flex justify-end mt-16 h-[56px]">
        <AnimatePresence>
          {selected && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() =>
                navigate("/app/builder", {
                  state: { resumeType: selected },
                })
              }
              className="px-8 py-3 rounded-xl font-medium bg-[#0A1A33] text-white hover:opacity-90"
            >
              Continue →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}