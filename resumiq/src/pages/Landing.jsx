import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function Landing() {
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  // Show buttons after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // ENTER → LOGIN shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && showButtons) {
        navigate("/login");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showButtons, navigate]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">

          {/* INTRO — FADE */}
          {!showButtons && (
            <div className="transition-opacity duration-700 opacity-100">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Resumiq
              </h1>
              <p className="text-lg text-gray-500">
                Create, manage & showcase your resume
              </p>
            </div>
          )}

          {/* CTA — FADE + SCALE */}
          {showButtons && (
            <div className="transition-all duration-700 opacity-100 scale-100">
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                Welcome to Resumiq
              </h2>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition transform hover:scale-[1.03] active:scale-[0.97]"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition transform hover:scale-[1.03] active:scale-[0.97]"
                >
                  Sign Up
                </button>
              </div>

              {/* Hint */}
              <p className="text-xs text-gray-400 mt-6">
                Press <span className="font-medium">Enter</span> to login
              </p>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
