import { motion } from "framer-motion";

const variants = {
  initial: {
    opacity: 0,
    filter: "blur(16px)",
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(16px)",
    scale: 0.96,
    transition: {
      duration: 0.7,
      ease: "easeIn",
    },
  },
};

export default function PageTransition({ children }) {
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
