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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
        
        {!showButtons ? (
          <>
            <h1 className="text-5xl font-bold mb-4">Resumiq</h1>
            <p className="text-lg text-gray-600">
              Create, manage & showcase your resume.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-semibold mb-6">
              Welcome to Resumiq
            </h2>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-3 border border-black rounded hover:bg-gray-200 transition"
              >
                Sign Up
              </button>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
