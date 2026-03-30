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
    return <p>No data</p>;
  }

  const current = data[index];

  return (
    <div className="flex justify-center items-center">
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
            className="absolute w-full h-full bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-between"
          >
            <img
              src={current.preview}
              alt={current.title}
              className="rounded-xl h-48 w-full object-cover"
            />

            <div>
              <h2 className="text-xl font-bold mt-4">
                {current.title}
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                {current.description}
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => handleSwipe("left")}
                className="px-4 py-2 border rounded-full"
              >
                Skip
              </button>

              <button
                onClick={() => handleSwipe("right")}
                className="px-4 py-2 bg-black text-white rounded-full"
              >
                Select
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}