import { motion } from "framer-motion";

export default function TransitionOverlay() {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}   // ✅ go fully across and exit automatically
      exit={{ x: "100%" }}
      transition={{
        duration: 0.8,
        ease: [0.77, 0, 0.175, 1],
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #85aec9ff, #67aab9ff)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}