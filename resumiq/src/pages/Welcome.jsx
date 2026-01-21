import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-root">
      <motion.div
        className="welcome-card"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Brand */}
        <h1 className="welcome-title">Welcome to Resumiq</h1>

        {/* Subtitle */}
        <p className="welcome-subtitle">
          Build professional, ATS-friendly resumes that actually get
          shortlisted.
        </p>

        {/* Buttons */}
        <div className="welcome-actions">
          <button
            className="welcome-btn primary"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>

          <button
            className="welcome-btn secondary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        {/* Footer hint */}
        <div className="welcome-footer">
          Fast • Clean • Recruiter-ready
        </div>
      </motion.div>
    </div>
  );
}
