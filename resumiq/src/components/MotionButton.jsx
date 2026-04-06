import { motion } from "framer-motion";

export default function MotionCard({
  children,
  className = "",
  ...props
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -4,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      className={`transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}