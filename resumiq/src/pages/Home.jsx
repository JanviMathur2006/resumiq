import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

const TOTAL_SLIDES = 3;

export default function Home() {
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  // Scroll helpers
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

  // Update active slide on manual scroll (swipe / trackpad)
  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const index = Math.round(slider.scrollLeft / slider.offsetWidth);
    setActiveSlide(index);
  };

  // ⌨️ Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        scrollLeft();
      }
      if (e.key === "ArrowRight") {
        scrollRight();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSlide]);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            All Resumes
          </h1>
          <p className="text-gray-600 text-lg">
            Manage, edit, and create your resumes effortlessly.
          </p>
        </div>

        {/* Slider Section */}
        <div className="relative">

          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            disabled={activeSlide === 0}
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
            className="overflow-x-auto scroll-smooth snap-x snap-mandatory"
          >
            <div className="flex gap-12">

              {/* Slide 1 */}
              <div className="snap-center min-w-full flex justify-center">
                <div className="w-full max-w-4xl h-[420px] bg-white rounded-3xl shadow-xl
                                flex flex-col items-center justify-center text-center px-10">

                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center
                                  justify-center text-4xl mb-6">
                    +
                  </div>

                  <h2 className="text-3xl font-semibold mb-3">
                    Create New Resume
                  </h2>

                  <p className="text-gray-600 text-lg mb-8 max-w-xl">
                    Build a professional, ATS-friendly resume in just a few minutes.
                  </p>

                  <button
                    onClick={() => navigate("/app/create")}
                    className="px-8 py-3 rounded-xl bg-black text-white text-lg
                               font-medium hover:bg-gray-800 transition"
                  >
                    Create Resume →
                  </button>
                </div>
              </div>

              {/* Slide 2 */}
              <div className="snap-center min-w-full flex justify-center">
                <div className="w-full max-w-4xl h-[420px] bg-white rounded-3xl shadow-xl
                                flex flex-col items-center justify-center text-center px-10">

                  <h2 className="text-3xl font-semibold mb-3">
                    My Resumes
                  </h2>

                  <p className="text-gray-600 text-lg mb-8 max-w-xl">
                    View, edit, and download all your saved resumes in one place.
                  </p>

                  <button
                    onClick={() => navigate("/app")}
                    className="px-8 py-3 rounded-xl bg-black text-white text-lg
                               font-medium hover:bg-gray-800 transition"
                  >
                    View Resumes →
                  </button>
                </div>
              </div>

              {/* Slide 3 */}
              <div className="snap-center min-w-full flex justify-center">
                <div className="w-full max-w-4xl h-[420px] bg-white rounded-3xl shadow-xl
                                flex flex-col items-center justify-center text-center px-10">

                  <h2 className="text-3xl font-semibold mb-3">
                    Resume Samples
                  </h2>

                  <p className="text-gray-600 text-lg mb-8 max-w-xl">
                    Explore professionally written resume samples for different roles.
                  </p>

                  <button
                    onClick={() => navigate("/app/create")}
                    className="px-8 py-3 rounded-xl bg-black text-white text-lg
                               font-medium hover:bg-gray-800 transition"
                  >
                    Browse Samples →
                  </button>
                </div>
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
              className={`h-3 w-3 rounded-full transition ${
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
