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

    navigate("/app/builder");

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

    <div className="relative w-full min-h-screen overflow-hidden bg-[#f5f7fb] flex flex-col items-center pt-16">

      {/* PREMIUM BACKGROUND GLOWS */}

      <div className="absolute top-[-150px] left-[-150px] w-[420px] h-[420px] bg-blue-300/40 rounded-full blur-[140px]"></div>

      <div className="absolute bottom-[-180px] right-[-180px] w-[420px] h-[420px] bg-blue-200/40 rounded-full blur-[140px]"></div>

      <div className="absolute top-[25%] right-[8%] w-[280px] h-[280px] bg-blue-400/20 rounded-full blur-[120px]"></div>

      {/* CONTENT */}

      <div className="relative z-10 flex flex-col items-center w-full">

        {/* HEADING */}

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-bold text-gray-900 mb-4 text-center"
        >
          Create a Resume
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 mb-12 text-xl text-center"
        >
          Swipe left to skip, right to select
        </motion.p>

        {/* TABS */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mb-14 flex-wrap justify-center"
        >

          {TABS.map((tab) => (

            <button
              key={tab}

              onClick={() => {
                setActiveTab(tab);
                setIndex(0);
              }}

              className={`
                px-7
                py-3
                rounded-full
                text-sm
                font-medium
                transition-all
                duration-300
                
                ${
                  activeTab === tab
                    ? "bg-black text-white shadow-xl"
                    : "bg-white/70 backdrop-blur-xl border border-white/50 text-gray-700 hover:bg-white"
                }
              `}
            >
              {tab}
            </button>

          ))}

        </motion.div>

        {/* CARD */}

        {filteredResumes.length > 0 && (

          <div className="relative w-[520px] h-[560px]">

            <AnimatePresence mode="wait">

              <motion.div
                key={current.id}

                drag="x"

                dragConstraints={{ left: 0, right: 0 }}

                onDragEnd={(e, info) => {

                  if (info.offset.x > 120) {
                    handleSwipe("right");
                  }

                  else if (info.offset.x < -120) {
                    handleSwipe("left");
                  }

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
                  rounded-[38px]
                  bg-white/65
                  backdrop-blur-[30px]
                  border
                  border-white/60
                  shadow-[0_25px_80px_rgba(0,0,0,0.10)]
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

                  <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                    {current.title}
                  </h2>

                  <p className="text-gray-600 mt-5 text-xl leading-relaxed">
                    {current.description}
                  </p>

                  <div className="mt-8 text-lg text-gray-500">

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
                      px-8
                      py-4
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
                      px-8
                      py-4
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