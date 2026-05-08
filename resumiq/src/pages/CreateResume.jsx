import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  const [index, setIndex] = useState(0);

  const filteredResumes =
    activeTab === "Recommended"
      ? RESUME_TYPES
      : RESUME_TYPES.filter((r) => r.tab === activeTab);

  const handleSelect = (resume) => {
    localStorage.setItem("resumeType", resume.id);
    navigate("/resume-builder");
  };

  const handleSwipe = (dir) => {
    if (filteredResumes.length === 0) return;

    if (dir === "right") {
      handleSelect(filteredResumes[index]);
    }

    setIndex((prev) => {
      const next = prev + 1;
      return next >= filteredResumes.length ? 0 : next;
    });
  };

  const current = filteredResumes[index];

  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-10 flex flex-col items-center">

      {/* BACKGROUND EFFECTS */}
      <div className="wave-bg"></div>

      <div className="bg-dots left"></div>

      <div className="bg-dots right"></div>

      {/* FLOATING BLUR CIRCLE */}
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-blue-200/30 blur-[120px] rounded-full animate-pulse"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-blue-300/20 blur-[120px] rounded-full animate-pulse"></div>

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">

        {/* HEADER */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-gray-900 mb-3 text-center"
        >
          Create Something Remarkable
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 mb-10 text-lg text-center"
        >
          Craft a resume that reflects your true potential.
        </motion.p>

        {/* TABS */}
        <div className="flex gap-3 mb-12 flex-wrap justify-center">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIndex(0);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
              ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white/70 backdrop-blur-md text-gray-700 hover:bg-white border border-white/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CARD CONTAINER */}
        {filteredResumes.length > 0 && (
          <div className="relative w-full max-w-[850px] h-[430px] flex items-center justify-center">

            {/* LEFT BUTTON */}
            <button
              onClick={() => handleSwipe("left")}
              className="absolute left-0 z-20 w-14 h-14 rounded-full bg-blue-600 text-white text-xl shadow-xl hover:scale-110 transition"
            >
              ←
            </button>

            {/* RIGHT BUTTON */}
            <button
              onClick={() => handleSwipe("right")}
              className="absolute right-0 z-20 w-14 h-14 rounded-full bg-blue-600 text-white text-xl shadow-xl hover:scale-110 transition"
            >
              →
            </button>

            <AnimatePresence mode="wait">

              <motion.div
                key={current.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 120) handleSwipe("right");
                  else if (info.offset.x < -120) handleSwipe("left");
                }}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0, x: 200 }}
                whileDrag={{ scale: 1.03, rotate: 2 }}
                transition={{ duration: 0.3 }}
                className="
                  absolute
                  w-full
                  max-w-[700px]
                  h-[360px]
                  bg-white/75
                  backdrop-blur-2xl
                  border border-white/40
                  rounded-[35px]
                  shadow-2xl
                  p-10
                  flex
                  flex-col
                  justify-between
                  cursor-grab
                  active:cursor-grabbing
                "
              >

                {/* CARD CONTENT */}
                <div>

                  <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-5">
                    {current.tab}
                  </div>

                  <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                    {current.title}
                  </h2>

                  <p className="text-gray-600 mt-5 text-lg leading-relaxed">
                    {current.description}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-gray-500">
                    <span className="font-semibold text-gray-700">
                      Best for:
                    </span>

                    <span>{current.bestFor}</span>
                  </div>

                </div>

                {/* BUTTONS */}
                <div className="flex justify-between items-center mt-10">

                  <button
                    onClick={() => handleSwipe("left")}
                    className="
                      px-6
                      py-3
                      rounded-full
                      border
                      border-gray-300
                      bg-white/70
                      hover:bg-gray-100
                      transition
                    "
                  >
                    Skip
                  </button>

                  <button
                    onClick={() => handleSwipe("right")}
                    className="
                      px-8
                      py-3
                      rounded-full
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      font-medium
                      shadow-lg
                      transition
                    "
                  >
                    Select Resume
                  </button>

                </div>

              </motion.div>

            </AnimatePresence>

          </div>
        )}

      </div>
    </div>
  );
}