import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { resumeTypes } from "../data/resumeTypes";

const TABS = [
  { id: "recommended", label: "Recommended" },
  { id: "students", label: "Students" },
  { id: "professionals", label: "Professionals" },
  { id: "specialized", label: "Specialized" },
];

export default function CreateResumes() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recommended");
  const [index, setIndex] = useState(0);

  const filteredTypes = resumeTypes.filter((t) =>
    t.category.includes(activeTab)
  );

  const handleSelect = (type) => {
    navigate("/app/builder", {
      state: {
        resumeType: type.id,
        sections: type.sections,
      },
    });
  };

  const handleSwipe = (dir) => {
    if (filteredTypes.length === 0) return;

    if (dir === "right") {
      handleSelect(filteredTypes[index]);
    }

    setIndex((prev) => {
      const next = prev + 1;
      return next >= filteredTypes.length ? 0 : next;
    });
  };

  const current = filteredTypes[index];

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex flex-col items-center">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-28 left-6 text-gray-400 hover:text-gray-900"
      >
        ←
      </button>

      <div className="max-w-4xl w-full px-6 py-12 flex flex-col items-center">

        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-gray-900">
          Choose Resume Type
        </h1>
        <p className="mt-2 text-gray-500">
          Swipe left to skip, right to select
        </p>

        {/* TABS */}
        <div className="mt-8 flex gap-3 flex-wrap justify-center">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-sm
                  ${
                    active
                      ? "bg-white border shadow-sm"
                      : "bg-gray-100 text-gray-600"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* SWIPE CARD */}
        {filteredTypes.length > 0 && (
          <div className="mt-10 relative w-[320px] h-[420px]">

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
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {current.name}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    {current.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {current.bestFor.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => handleSwipe("left")}
                    className="px-5 py-2 border rounded-full"
                  >
                    Skip
                  </button>

                  <button
                    onClick={() => handleSwipe("right")}
                    className="px-5 py-2 bg-black text-white rounded-full"
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