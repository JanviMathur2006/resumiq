import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SwipeResumeSelector({ data, onSelect }) {
  const [index, setIndex] = useState(0);

  const handleSwipe = (dir) => {
    if (dir === "right") {
      onSelect(data[index].id);
    }

    setIndex((prev) => (prev + 1) % data.length);
  };

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7faff]">
        <p className="text-gray-500 text-xl">No resume templates found</p>
      </div>
    );
  }

  const current = data[index];

  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-[#f7faff] px-6">

      {/* Animated Background Blobs */}
      <div className="absolute top-[-150px] left-[-120px] w-[500px] h-[500px] bg-blue-300 opacity-40 blur-[120px] rounded-full animate-blob"></div>

      <div className="absolute bottom-[-150px] right-[-120px] w-[500px] h-[500px] bg-blue-400 opacity-30 blur-[120px] rounded-full animate-blob animation-delay-2000"></div>

      <div className="absolute top-[35%] right-[18%] w-[350px] h-[350px] bg-blue-200 opacity-30 blur-[100px] rounded-full animate-blob animation-delay-4000"></div>

      <div className="absolute bottom-[15%] left-[10%] w-[280px] h-[280px] bg-sky-200 opacity-25 blur-[100px] rounded-full animate-blob animation-delay-3000"></div>


      {/* Main Content */}
      <div className="flex flex-col items-center z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold text-gray-900">
            Create a Resume
          </h1>

          <p className="text-gray-500 text-lg mt-3">
            Swipe left to skip, right to select
          </p>
        </motion.div>

        {/* Category Buttons */}
        <div className="flex gap-4 mb-10 flex-wrap justify-center">
          <button className="px-6 py-3 bg-black text-white rounded-full shadow-lg">
            Recommended
          </button>

          <button className="px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border border-white/40">
            Students
          </button>

          <button className="px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border border-white/40">
            Professionals
          </button>

          <button className="px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border border-white/40">
            Specialized
          </button>
        </div>

        {/* Swipe Card */}
        <div className="relative w-[680px] h-[620px]">

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
              exit={{ opacity: 0, x: 250, rotate: 10 }}
              transition={{ duration: 0.35 }}
              whileDrag={{
                scale: 1.03,
                rotate: info?.offset?.x > 0 ? 4 : -4,
              }}
              className="absolute w-full h-full bg-white/70 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/40 p-10 flex flex-col justify-between"
            >

              {/* Preview Image */}
              <img
                src={current.preview}
                alt={current.title}
                className="rounded-[28px] h-72 w-full object-cover shadow-md"
              />

              {/* Content */}
              <div className="mt-6">
                <h2 className="text-4xl font-bold text-gray-900">
                  {current.title}
                </h2>

                <p className="text-gray-500 text-lg mt-4 leading-relaxed">
                  {current.description}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center mt-8">

                <button
                  onClick={() => handleSwipe("left")}
                  className="px-8 py-3 border border-gray-300 rounded-full text-lg bg-white/70 hover:bg-gray-100 transition-all duration-300"
                >
                  Skip
                </button>

                <button
                  onClick={() => handleSwipe("right")}
                  className="px-8 py-3 bg-black text-white rounded-full text-lg shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Select
                </button>

              </div>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}