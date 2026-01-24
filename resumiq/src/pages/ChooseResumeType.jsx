import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const TABS = ["Recommended", "Students", "Professionals", "Specialized"];

const RESUMES = [
  {
    id: "student",
    title: "Fresher / Student Resume",
    description: "Best for students and fresh graduates",
    bestFor: "Students, freshers",
    tab: "Students",
    recommended: true,
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
    id: "career",
    title: "Career Switch Resume",
    description: "Transition into a new career path",
    bestFor: "Career changers",
    tab: "Specialized",
  },
];

/* =======================
   ANIMATION VARIANTS
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
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
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

  /* =======================
     ENTER → CONTINUE
  ======================= */
  useEffect(() => {
    const handleKey = e => {
      if (e.key === "Enter" && selected) {
        navigate("/app/builder", {
          state: { resumeType: selected },
        });
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
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="min-h-screen bg-[#f6f8fb] px-12 py-10"
    >
      {/* Header */}
      <h1 className="text-3xl font-semibold text-gray-900">
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
                  ? "bg-black text-white"
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
              animate={
                isSelected
                  ? { scale: [1, 0.97, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={() => setSelected(card.id)}
              className={`relative cursor-pointer rounded-2xl p-6 bg-white
                ${
                  isSelected
                    ? "border-2 border-black shadow-lg"
                    : "border border-gray-200 hover:shadow-md"
                }`}
            >
              {/* Checkmark */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-sm"
                  >
                    ✓
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Best Match */}
              {card.recommended && (
                <span className="inline-block text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full mb-4">
                  ✓ Best Match
                </span>
              )}

              <h3 className="text-lg font-semibold text-gray-900">
                {card.title}
              </h3>

              <p className="text-gray-600 mt-2 text-sm">
                {card.description}
              </p>

              <p className="text-gray-400 text-sm mt-6">
                Best for: {card.bestFor}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Continue (slides in only when enabled) */}
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
              className="px-8 py-3 rounded-xl font-medium bg-black text-white hover:opacity-90"
            >
              Continue →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
