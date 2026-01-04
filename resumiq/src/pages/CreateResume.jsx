import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CreateResumeCard() {
  return (
    <Link to="/app/create" className="block">
      <motion.div
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="w-full bg-white rounded-3xl p-16
                   flex flex-col items-center justify-center
                   cursor-pointer hover:shadow-xl"
      >
        {/* PLUS ICON */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 mb-6 rounded-full bg-gray-100
                     flex items-center justify-center
                     text-3xl font-medium"
        >
          +
        </motion.div>

        <h2 className="text-2xl font-bold mb-2">
          Create New Resume
        </h2>

        <p className="text-gray-600 mb-6 text-center max-w-md">
          Build a professional, ATS-friendly resume in just a few minutes.
        </p>

        <div className="px-6 py-3 rounded-lg bg-black text-white font-medium">
          Create Resume →
        </div>
      </motion.div>
    </Link>
  );
}
