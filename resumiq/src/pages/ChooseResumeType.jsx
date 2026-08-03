import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

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
    <div className="relative min-h-screen overflow-hidden px-6 py-10">
      {/* BACK BUTTON */}
<button
  onClick={() => navigate(-1)}
  className="
    absolute
    top-8
    left-8
    z-50
    w-14
    h-14
    rounded-2xl
    bg-white/90
    backdrop-blur-md
    border
    border-white/60
    shadow-xl
    flex
    items-center
    justify-center
    hover:scale-105
    hover:shadow-2xl
    transition-all
    duration-300
  "
>
  <ArrowLeft size={28} className="text-[#0A1A33]" />
</button>

      {/* BACKGROUND */}
      <div className="wave-bg"></div>

      <div className="bg-dots left"></div>

      <div className="bg-dots right"></div>

      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-200/30 rounded-full blur-[120px]"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-indigo-200/20 rounded-full blur-[120px]"></div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">

        {/* HEADER */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-[#0A1A33] text-center"
        >
          Create Something Remarkable
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 mt-3 text-lg text-center"
        >
          Craft a resume that reflects your true potential.
        </motion.p>

        {/* ACTIVE TITLE */}
        <motion.h2
          key={current?.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 text-3xl font-semibold text-blue-800"
        >
          {current?.title}
        </motion.h2>

        {/* TABS */}
        <div className="flex gap-3 mt-8 flex-wrap justify-center">

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
                    : "bg-white/70 backdrop-blur-md border border-white/40 text-gray-700 hover:bg-white"
                }`}
            >
              {tab}
            </button>
          ))}

        </div>

        {/* CARD AREA */}
        <div className="mt-16 relative w-full flex justify-center items-center min-h-[430px]">

          {/* LEFT BUTTON */}
          <button
            onClick={() => handleSwipe("left")}
            className="
              absolute
              left-0
              z-20
              w-14
              h-14
              rounded-full
              bg-blue-600
              text-white
              text-xl
              shadow-xl
              hover:scale-110
              transition
            "
          >
            ←
          </button>

          {/* RIGHT BUTTON */}
          <button
            onClick={() => handleSwipe("right")}
            className="
              absolute
              right-0
              z-20
              w-14
              h-14
              rounded-full
              bg-blue-600
              text-white
              text-xl
              shadow-xl
              hover:scale-110
              transition
            "
          >
            →
          </button>

          {filtered.length > 0 ? (

            <div className="relative w-full max-w-[850px] h-[420px]">

              <AnimatePresence mode="wait">

                <motion.div
                  key={current.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x > 120) handleSwipe("right");
                    else if (info.offset.x < -120)
                      handleSwipe("left");
                  }}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0, x: 200 }}
                  whileDrag={{
                    scale: 1.03,
                    rotate: 2,
                  }}
                  transition={{ duration: 0.3 }}
                  className="
                    absolute
                    w-full
                    h-full
                    bg-white/75
                    backdrop-blur-2xl
                    border
                    border-white/40
                    rounded-[35px]
                    shadow-2xl
                    p-8
                    flex
                    gap-8
                    items-center
                    cursor-grab
                    active:cursor-grabbing
                  "
                >

                  {/* LEFT IMAGE */}
                  <div className="w-[45%] h-full">

                    <img
                      src={current.preview}
                      alt={current.title}
                      className="
                        w-full
                        h-full
                        object-cover
                        rounded-3xl
                        shadow-lg
                      "
                    />

                  </div>

                  {/* RIGHT CONTENT */}
                  <div className="flex-1 flex flex-col justify-between h-full">

                    <div>

                      <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                        {current.tab}
                      </div>

                      <h2 className="text-4xl font-bold text-[#0A1A33] mt-5 leading-tight">
                        {current.title}
                      </h2>

                      <p className="text-gray-600 mt-5 text-lg leading-relaxed">
                        {current.description}
                      </p>

                      <div className="mt-8 text-gray-500">
                        <span className="font-semibold text-gray-700">
                          Best for:
                        </span>{" "}
                        {current.bestFor}
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

                  </div>

                </motion.div>

              </AnimatePresence>

            </div>

          ) : (
            <p className="text-gray-500 mt-10">
              No resumes found
            </p>
          )}

        </div>

      </div>
    </div>
  );
}