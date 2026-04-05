import { motion } from "framer-motion";

const variants = {
  initial: {
    opacity: 0,
    filter: "blur(12px)",
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: 0.2, // ⏱ lets blue layer finish first
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(12px)",
    scale: 0.98,
    transition: {
      duration: 0.4,
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
      style={{
        position: "relative", // ✅ keep content normal (overlay handles full screen)
        width: "100%",
        minHeight: "100vh",

        willChange: "opacity, filter, transform",
        backgroundColor: "rgba(246,247,251,0.95)",
      }}
    >
      {children}
    </motion.div>
  );
}