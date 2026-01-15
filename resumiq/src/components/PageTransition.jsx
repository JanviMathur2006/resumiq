import { motion } from "framer-motion";

const variants = {
  initial: {
    opacity: 0,
    filter: "blur(4px)",
    scale: 0.99,
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(4px)",
    scale: 0.99,
    transition: {
      duration: 0.25,
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
      style={{ willChange: "opacity, filter, transform" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
