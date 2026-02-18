import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import PageTransition from "../components/PageTransition";
import { resumeTypes } from "../data/resumeTypes";

/* FIREBASE */
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

const TOTAL_SLIDES = 3;

export default function Home() {
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  /* CARD 2 — USER RESUMES */
  const [userResumes, setUserResumes] = useState([]);
  const [loadingUserResumes, setLoadingUserResumes] = useState(true);

  const resumeNames = resumeTypes.map((type) => type.name);

  /* ================= SLIDER FUNCTIONS ================= */

  const scrollToSlide = (index) => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollTo({
      left: index * slider.offsetWidth,
      behavior: "smooth",
    });

    setActiveSlide(index);
  };

  const scrollLeft = () => {
    if (activeSlide > 0) {
      scrollToSlide(activeSlide - 1);
    }
  };

  const scrollRight = () => {
    if (activeSlide < TOTAL_SLIDES - 1) {
      scrollToSlide(activeSlide + 1);
    }
  };

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const index = Math.round(slider.scrollLeft / slider.offsetWidth);
    setActiveSlide(index);
  };

  /* ================= KEYBOARD NAVIGATION ================= */

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") scrollLeft();
      if (e.key === "ArrowRight") scrollRight();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSlide]);

  /* ================= FETCH USER RESUMES ================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserResumes([]);
        setLoadingUserResumes(false);
        return;
      }

      const q = query(
        collection(db, "resumes"),
        where("userId", "==", user.uid)
      );

      const snap = await getDocs(q);

      setUserResumes(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

      setLoadingUserResumes(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Build Your Resume
          </h1>

          {/* 🔵 COLOR CHANGED HERE */}
          <h2 className="text-2xl font-medium text-[#0A1A33] mb-3">
            <Typewriter
              words={resumeNames}
              loop={0}
              cursor
              cursorStyle="|"
            />
          </h2>

          <p className="text-gray-600 text-lg">
            ATS-friendly • Professional • Recruiter-approved
          </p>
        </motion.div>

        {/* ================= SLIDER ================= */}
        <div className="relative">

          {/* LEFT ARROW */}
          <button
            onClick={scrollLeft}
            disabled={activeSlide === 0}
            className={`hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20
              h-12 w-12 items-center justify-center rounded-full shadow-lg transition
              ${
                activeSlide === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
          >
            ←
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={scrollRight}
            disabled={activeSlide === TOTAL_SLIDES - 1}
            className={`hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20
              h-12 w-12 items-center justify-center rounded-full shadow-lg transition
              ${
                activeSlide === TOTAL_SLIDES - 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
          >
            →
          </button>

          {/* SLIDER TRACK */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="overflow-x-auto snap-x snap-mandatory scroll-smooth"
          >
            <div className="flex gap-12">

              {/* CARD 1 — CATEGORIES */}
              <div className="snap-center min-w-full flex justify-center">
                <Link to="/app/create" className="w-full max-w-4xl">
                  <motion.div
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-[420px] bg-white rounded-3xl shadow-xl
                      flex flex-col items-center justify-center
                      text-center px-10 cursor-pointer"
                  >
                    <h2 className="text-3xl font-semibold mb-3">
                      Create New Resume
                    </h2>
                    <p className="text-gray-600">
                      Choose from multiple resume categories.
                    </p>
                  </motion.div>
                </Link>
              </div>

              {/* CARD 2 — MY RESUMES */}
              <div className="snap-center min-w-full flex justify-center">
                <motion.div
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full max-w-4xl h-[420px] bg-white rounded-3xl shadow-xl
                    flex flex-col items-center justify-center
                    text-center px-10"
                >
                  <h2 className="text-3xl font-semibold mb-4">
                    My Resumes
                  </h2>

                  {loadingUserResumes ? (
                    <p className="text-gray-500">Loading…</p>
                  ) : userResumes.length === 0 ? (
                    <p className="text-gray-500">Nothing created yet</p>
                  ) : (
                    <div className="w-full max-w-md flex flex-col gap-3">
                      {userResumes.map((resume) => (
                        <div
                          key={resume.id}
                          onClick={() =>
                            navigate(`/app/builder?id=${resume.id}`)
                          }
                          className="border rounded-xl px-4 py-2 cursor-pointer
                            hover:bg-gray-50 transition text-left"
                        >
                          {resume.title || "Untitled Resume"}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* CARD 3 — SAMPLES */}
              <div className="snap-center min-w-full flex justify-center">
                <motion.div
                  onClick={() => navigate("/app/samples")}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full max-w-4xl h-[420px] bg-white rounded-3xl shadow-xl
                    flex flex-col items-center justify-center
                    text-center px-10 cursor-pointer"
                >
                  <h2 className="text-3xl font-semibold mb-3">
                    Resume Samples
                  </h2>
                  <p className="text-gray-600">
                    Explore fulfilled, recruiter-approved samples.
                  </p>
                </motion.div>
              </div>

            </div>
          </div>
        </div>

        {/* DOTS */}
        <div className="flex justify-center gap-3 mt-6">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => scrollToSlide(i)}
              className={`h-3 w-3 rounded-full transition
                ${
                  activeSlide === i
                    ? "bg-black scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
            />
          ))}
        </div>

      </div>
    </PageTransition>
  );
}
