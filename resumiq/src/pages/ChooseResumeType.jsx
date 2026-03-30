import { useState } from "react";
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
    preview: "/templates/fresher.png",
  },
  {
    id: "professional",
    title: "Experienced Professional Resume",
    description: "For professionals with work experience",
    bestFor: "1–15 years experience",
    tab: "Professionals",
    preview: "/templates/pro.png",
  },
  {
    id: "internship",
    title: "Internship Resume",
    description: "Apply confidently for internships",
    bestFor: "Internships",
    tab: "Students",
    preview: "/templates/intern.png",
  },
  {
    id: "career",
    title: "Career Switch Resume",
    description: "Transition into a new career path",
    bestFor: "Career changers",
    tab: "Specialized",
    preview: "/templates/switch.png",
  },
];

export default function ChooseResumeType() {
  const [activeTab, setActiveTab] = useState("Recommended");
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const filtered =
    activeTab === "Recommended"
      ? RESUMES
      : RESUMES.filter((r) => r.tab === activeTab);

  const handleSelect = (id) => {
    navigate("/app/builder", {
      state: { resumeType: id },
    });
  };

  const handleSwipe = (dir) => {
    if (filtered.length === 0) return;

    if (dir === "right") {
      handleSelect(filtered[index].id);
    }

    setIndex((prev) => {
      const next = prev + 1;
      return next >= filtered.length ? 0 : next;
    });
  };

  const current = filtered[index];

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-6 py-10 flex flex-col items-center">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold text-[#0A1A33]">
        Choose Resume Type
      </h1>
      <p className="text-gray-500 mt-1">
        Swipe left to skip, right to select
      </p>

      {/* TABS */}
      <div className="flex gap-3 mt-8 flex-wrap justify-center">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIndex(0); // reset swipe on tab change
            }}
            className={`px-5 py-2 rounded-full text-sm transition
              ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "bg-white border text-gray-600 hover:bg-gray-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SWIPE CARD */}
      <div className="mt-10 flex justify-center items-center">

        {filtered.length > 0 ? (
          <div className="relative w-[320px] h-[420px]">

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 120) handleSwipe("right");
                  else if (info.offset.x < -120) handleSwipe("left");
                }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0, x: 200 }}
                whileDrag={{ scale: 1.05 }}
                className="absolute w-full h-full bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing"
              >
                {/* IMAGE */}
                <img
                  src={current.preview}
                  alt={current.title}
                  className="rounded-xl h-48 w-full object-cover"
                />

                {/* TEXT */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mt-4">
                    {current.title}
                  </h2>
                  <p className="text-gray-500 text-sm mt-2">
                    {current.description}
                  </p>
                </div>

                {/* BUTTONS */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleSwipe("left")}
                    className="px-5 py-2 rounded-full border"
                  >
                    Skip
                  </button>

                  <button
                    onClick={() => handleSwipe("right")}
                    className="px-5 py-2 rounded-full bg-black text-white"
                  >
                    Select
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        ) : (
          <p className="text-gray-500 mt-10">No resumes found</p>
        )}

      </div>
    </div>
  );
}