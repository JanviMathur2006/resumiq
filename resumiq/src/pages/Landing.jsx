import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">

          {/* INTRO */}
          {!showButtons && (
            <>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Resumiq
              </h1>
              <p className="text-lg text-gray-500">
                Create, manage & showcase your resume
              </p>
            </>
          )}

          {/* BUTTONS */}
          {showButtons && (
            <>
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                Welcome to Resumiq
              </h2>

              <div className="flex gap-4 justify-center">

                {/* LOGIN — SOLID BLACK */}
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition"
                >
                  Login
                </button>

                {/* SIGN UP — BLACK OUTLINE */}
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-3 border-2 border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition"
                >
                  Sign Up
                </button>

              </div>
            </>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
