import { motion } from "framer-motion";

export default function ResumeStrength({ score }) {
  let label = "Weak";
  let color = "bg-red-500";

  if (score >= 70) {
    label = "Strong";
    color = "bg-green-500";
  } else if (score >= 40) {
    label = "Good";
    color = "bg-yellow-500";
  }

  return (
    <div className="w-full max-w-md mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">
          Resume Strength
        </span>
        <span className="text-sm font-semibold text-gray-800">
          {label}
        </span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
