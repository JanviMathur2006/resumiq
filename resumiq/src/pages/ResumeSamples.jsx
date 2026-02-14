import { useState } from "react";
import { resumeTypeSamples } from "../data/resumeTypeSamples";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* =======================
   FILTER TABS
======================= */
const TABS = [
  { id: "all", label: "All" },
  { id: "fresher", label: "Fresher / Student" },
  { id: "professional", label: "Professional" },
  { id: "internship", label: "Internship" },
  { id: "careerSwitch", label: "Career Switch" },
];

/* =======================
   ANIMATIONS
======================= */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function ResumeSamples() {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const samplesToShow =
    activeTab === "all"
      ? Object.values(resumeTypeSamples)
      : resumeTypeSamples[activeTab]
      ? [resumeTypeSamples[activeTab]]
      : [];

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* HEADER */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">
            Resume Samples
          </h1>
          <p className="text-gray-600 text-lg">
            Recruiter-approved resume examples for every career stage.
          </p>
        </motion.div>

        {/* FILTER TABS WITH HOVER GLOW + SMOOTH UNDERLINE */}
        <div className="flex justify-center gap-6 mb-14 flex-wrap">

          {TABS.map((tab) => (
            <div key={tab.id} className="flex flex-col items-center relative">

              <button
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "bg-black text-white shadow-lg shadow-black/30 scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md hover:shadow-gray-300/60 hover:scale-105"
                  }
                `}
              >
                {tab.label}
              </button>

              {activeTab === tab.id && (
                <motion.div
                  layoutId="tabUnderline"
                  className="h-[3px] w-10 bg-black mt-2 rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

            </div>
          ))}

        </div>

        {/* SAMPLE CARDS */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-12"
        >
          {samplesToShow.map((sample, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 p-10
                         hover:shadow-xl transition-all duration-300"
            >
              {/* CARD HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                    {sample.title}
                  </h2>
                  <p className="text-gray-600">
                    Ideal for {sample.bestFor}
                  </p>
                </div>

                <div className="flex gap-3">

                  <button
                    className="
                      px-6 py-2.5 rounded-xl
                      border border-gray-300
                      text-gray-800 font-medium
                      bg-white
                      hover:bg-gray-900 hover:text-white
                      hover:border-gray-900
                      hover:scale-[1.02]
                      active:scale-95
                      transition-all duration-200
                    "
                  >
                    Preview
                  </button>

                  <button
                    onClick={() => navigate("/app/create")}
                    className="
                      px-6 py-2.5 rounded-xl
                      bg-gray-900 text-white font-medium
                      hover:bg-gray-800
                      hover:scale-[1.02]
                      active:scale-95
                      transition-all duration-200
                      shadow-md
                    "
                  >
                    Use Template →
                  </button>

                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
                <SampleBlock title="Professional Summary" items={sample.summary} />
                <SampleBlock title="Work Experience" items={sample.experience} />
                <SampleBlock title="Projects" items={sample.projects} />
                <SampleBlock title="Skills" items={sample.skills} />
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}

/* =======================
   SAMPLE SECTION BLOCK
======================= */
function SampleBlock({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        {title}
      </h3>
      <ul className="space-y-2 text-gray-700">
        {items.map((item, i) => (
          <li key={i} className="leading-relaxed">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
