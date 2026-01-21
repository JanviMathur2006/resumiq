import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

export default function Landing() {
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition>
      <div className="welcome-root">
        <motion.div
          className="welcome-card"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* INTRO */}
          {!showButtons && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="welcome-title">Resumiq</h1>
              <p className="welcome-subtitle">
                Create, manage & showcase your resume
              </p>
            </motion.div>
          )}

          {/* BUTTONS */}
          {showButtons && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="welcome-title" style={{ fontSize: "24px" }}>
                Welcome to Resumiq
              </h2>

              <p className="welcome-subtitle">
                Build professional, ATS-friendly resumes that actually get shortlisted.
              </p>

              <div className="welcome-actions">
                <button
                  className="welcome-btn primary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>

                <button
                  className="welcome-btn secondary"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </div>

              <div className="welcome-footer">
                Fast • Clean • Recruiter-ready
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
