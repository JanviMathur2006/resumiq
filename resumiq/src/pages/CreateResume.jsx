import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  "Recommended",
  "Students",
  "Professionals",
  "Specialized",
];

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
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fb] px-6 py-10 flex flex-col items-center justify-center">

      {/* PREMIUM BLUR BACKGROUNDS */}

      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-blue-200/40 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-blue-100/40 rounded-full blur-3xl"></div>

      <div className="absolute top-[20%] right-[10%] w-[250px] h-[250px] bg-blue-300/20 rounded-full blur-3xl"></div>

      {/* MAIN CONTENT */}

      <div className="relative z-10 flex flex-col items-center w-full">

        {/* HEADING */}

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-gray-900 mb-3 text-center"
        >
          Create a Resume
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 mb-10 text-lg text-center"
        >
          Swipe left to skip, right to select
        </motion.p>

        {/* TABS */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mb-12 flex-wrap justify-center"
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIndex(0);
              }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
              
              ${
                activeTab === tab
                  ? "bg-black text-white shadow-lg"
                  : "bg-white/70 backdrop-blur-xl border border-white/50 text-gray-700 hover:bg-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* CARD */}

        {filteredResumes.length > 0 && (
          <div className="relative w-[420px] h-[500px]">

            <AnimatePresence mode="wait">

              <motion.div
                key={current.id}

                drag="x"

                dragConstraints={{ left: 0, right: 0 }}

                onDragEnd={(e, info) => {
                  if (info.offset.x > 120)
                    handleSwipe("right");

                  else if (info.offset.x < -120)
                    handleSwipe("left");
                }}

                initial={{
                  scale: 0.92,
                  opacity: 0,
                  y: 40,
                }}

                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                }}

                exit={{
                  opacity: 0,
                  x: 200,
                }}

                whileDrag={{
                  scale: 1.03,
                  rotate: 2,
                }}

                transition={{
                  duration: 0.4,
                }}

                className="
                  absolute
                  w-full
                  h-full
                  bg-white/80
                  backdrop-blur-2xl
                  border
                  border-white/50
                  rounded-[36px]
                  shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                  p-8
                  flex
                  flex-col
                  justify-between
                  cursor-grab
                  active:cursor-grabbing
                "
              >

                {/* CONTENT */}

                <div>

                  <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                    {current.title}
                  </h2>

                  <p className="text-gray-600 mt-4 text-lg leading-relaxed">
                    {current.description}
                  </p>

                  <div className="mt-8 text-gray-500 text-lg">

                    <span className="font-semibold text-gray-700">
                      Best for:
                    </span>{" "}

                    {current.bestFor}

                  </div>

                </div>

                {/* BUTTONS */}

                <div className="flex justify-between items-center">

                  <button
                    onClick={() => handleSwipe("left")}
                    className="
                      px-7
                      py-3
                      rounded-full
                      border
                      border-gray-300
                      bg-white/60
                      backdrop-blur-md
                      hover:bg-white
                      transition-all
                      duration-300
                    "
                  >
                    Skip
                  </button>

                  <button
                    onClick={() => handleSwipe("right")}
                    className="
                      px-7
                      py-3
                      rounded-full
                      bg-black
                      text-white
                      shadow-xl
                      hover:scale-105
                      transition-all
                      duration-300
                    "
                  >
                    Select
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