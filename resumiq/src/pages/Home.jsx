import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import PageTransition from "../components/PageTransition";
import { resumeTypes } from "../data/resumeTypes";

const TOTAL_SLIDES = 3;

export default function Home() {
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  // extract resume names for typing
  const resumeNames = resumeTypes.map((type) => type.name);

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
    if (activeSlide > 0) scrollToSlide(activeSlide - 1);
  };

  const scrollRight = () => {
    if (activeSlide < TOTAL_SLIDES - 1) scrollToSlide(activeSlide + 1);
  };

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const index = Math.round(slider.scrollLeft / slider.offsetWidth);
    setActiveSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") scrollLeft();
      if (e.key === "ArrowRight") scrollRight();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSlide]);

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

          {/* ✅ Typing Resume Types */}
          <h2 className="text-2xl font-medium text-green-600 mb-3">
            <Typewriter
              words={resumeNames}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={65}
              deleteSpeed={45}
              delaySpeed={1200}
            />
          </h2>

          <p className="text-gray-600 text-lg">
            ATS-friendly • Professional • Recruiter-approved
          </p>
        </motion.div>

        {/* ================= SLIDER SECTION ================= */}
        <div className="relative">

          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            disabled={activeSlide === 0}
            aria-label="Previous slide"
            className={`hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20
                        h-12 w-12 items-center justify-center rounded-full
                        shadow-lg transition
                        ${
                          activeSlide === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                        }`}
          >
            ←
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            disabled={activeSlide === TOTAL_SLIDES - 1}
            aria-label="Next slide"
            className={`hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20
                        h-12 w-12 items-center justify-center rounded-full
                        shadow-lg transition
                        ${
                          activeSlide === TOTAL_SLIDES - 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                        }`}
          >
            →
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="overflow-x-auto snap-x snap-mandatory scroll-smooth"
          >
            <div className="flex gap-12">

              {/* SLIDE 1 */}
              <div className="snap-center min-w-full flex justify-center">
                <Link to="/app/create" className="w-full max-w-4xl">
                  <motion.div
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="h-[420px] bg-white rounded-3xl shadow-xl
                               flex flex-col items-center justify-center
                               text-center px-10 cursor-pointer"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 rounded-full bg-gray-100
                                 flex items-center justify-center
                                 text-4xl mb-6"
                    >
                      +
                    </motion.div>

                    <h2 className="text-3xl font-semibold mb-3">
                      Create New Resume
                    </h2>

                    <p className="text-gray-600 text-lg mb-8 max-w-xl">
                      Build a professional, ATS-friendly resume in just minutes.
                    </p>

                    <div className="px-8 py-3 rounded-xl bg-black text-white
                                    text-lg font-medium">
                      Create Resume →
                    </div>
                  </motion.div>
                </Link>
              </div>

              {/* SLIDE 2 */}
              <div className="snap-center min-w-full flex justify-center">
                <motion.div
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="w-full max-w-4xl h-[420px] bg-white rounded-3xl shadow-xl
                             flex flex-col items-center justify-center
                             text-center px-10 cursor-pointer"
                  onClick={() => navigate("/app")}
                >
                  <h2 className="text-3xl font-semibold mb-3">
                    My Resumes
                  </h2>

                  <p className="text-gray-600 text-lg mb-8 max-w-xl">
                    View, edit, and download all your resumes in one place.
                  </p>

                  <div className="px-8 py-3 rounded-xl bg-black text-white
                                  text-lg font-medium">
                    View Resumes →
                  </div>
                </motion.div>
              </div>

              {/* SLIDE 3 */}
              <div className="snap-center min-w-full flex justify-center">
                <motion.div
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="w-full max-w-4xl h-[420px] bg-white rounded-3xl shadow-xl
                             flex flex-col items-center justify-center
                             text-center px-10 cursor-pointer"
                  onClick={() => navigate("/app/create")}
                >
                  <h2 className="text-3xl font-semibold mb-3">
                    Resume Samples
                  </h2>

                  <p className="text-gray-600 text-lg mb-8 max-w-xl">
                    Explore professionally written resume samples.
                  </p>

                  <div className="px-8 py-3 rounded-xl bg-black text-white
                                  text-lg font-medium">
                    Browse Samples →
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </div>

        {/* Dots */}
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

        {/* Hint */}
        <p className="text-center text-gray-400 mt-4 text-sm">
          Swipe, use arrows, dots, or ← → keys to explore
        </p>

      </div>
    </PageTransition>
  );
}
