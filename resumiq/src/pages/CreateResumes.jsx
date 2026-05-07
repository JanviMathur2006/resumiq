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

    <div className="relative overflow-hidden min-h-screen max-w-6xl mx-auto px-6 py-10 flex flex-col items-center">

      {/* ANIMATED BACKGROUND */}

      <div className="animated-bg"></div>

      <div className="animated-bg-2"></div>

      {/* CONTENT */}

      <div className="relative z-10 flex flex-col items-center w-full">

        {/* HEADER */}

        <h1 className="text-3xl font-bold mb-2">
          Create a Resume
        </h1>

        <p className="text-gray-500 mb-8">
          Swipe left to skip, right to select
        </p>

        {/* TABS */}

        <div className="flex gap-3 mb-10 flex-wrap justify-center">

          {TABS.map((tab) => (

            <button
              key={tab}

              onClick={() => {
                setActiveTab(tab);
                setIndex(0);
              }}

              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
              
              ${
                activeTab === tab
                  ? "bg-black text-white shadow-lg"
                  : "bg-white/70 backdrop-blur-md text-gray-700 hover:bg-white"
              }`}
            >
              {tab}
            </button>

          ))}

        </div>

        {/* SWIPE CARD */}

        {filteredResumes.length > 0 && (

          <div className="relative w-[320px] h-[420px]">

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
                  scale: 0.95,
                  opacity: 0
                }}

                animate={{
                  scale: 1,
                  opacity: 1
                }}

                exit={{
                  opacity: 0,
                  x: 200
                }}

                whileDrag={{
                  scale: 1.05
                }}

                className="absolute w-full h-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing"
              >

                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    {current.title}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    {current.description}
                  </p>

                  <p className="text-sm text-gray-500 mt-4">

                    <span className="font-medium text-gray-700">
                      Best for:
                    </span>{" "}

                    {current.bestFor}

                  </p>

                </div>

                <div className="flex justify-between mt-6">

                  <button
                    onClick={() => handleSwipe("left")}

                    className="px-5 py-2 border border-gray-300 bg-white/70 backdrop-blur-md rounded-full hover:bg-gray-100 transition-all"
                  >
                    Skip
                  </button>

                  <button
                    onClick={() => handleSwipe("right")}

                    className="px-5 py-2 bg-black text-white rounded-full hover:scale-105 transition-all"
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