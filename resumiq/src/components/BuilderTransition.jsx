import { motion } from "framer-motion";

const variants = {
  initial: {
    opacity: 0,
    filter: "blur(20px)",
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1], // cinematic easing
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(20px)",
    scale: 0.95,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

export default function BuilderTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen w-full"
      style={{
        willChange: "opacity, filter, transform",
        backgroundColor: "rgba(246,247,251,0.95)",
      }}
    >
      {children}
    </motion.div>
  );
}
