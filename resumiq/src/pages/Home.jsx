import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function Home() {
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -window.innerWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: window.innerWidth,
      behavior: "smooth",
    });
  };

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

        {/* Slider Wrapper */}
        <div className="relative">

          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white shadow-lg items-center justify-center text-xl hover:bg-gray-100"
          >
            ←
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white shadow-lg items-center justify-center text-xl hover:bg-gray-100"
          >
            →
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="overflow-x-auto scroll-smooth snap-x snap-mandatory"
          >
            <div className="flex gap-10">

              {/* Slide 1 */}
              <div className="snap-center min-w-full flex justify-center">
                <div className="w-full max-w-4xl h-[420px] bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center text-center px-10">

                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl mb-6">
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
                    className="px-8 py-3 rounded-xl bg-black text-white text-lg font-medium hover:bg-gray-800 transition"
                  >
                    Create Resume →
                  </button>
                </div>
              </div>

              {/* Slide 2 */}
              <div className="snap-center min-w-full flex justify-center">
                <div className="w-full max-w-4xl h-[420px] bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center text-center px-10">

                  <h2 className="text-3xl font-semibold mb-3">
                    My Resumes
                  </h2>

                  <p className="text-gray-600 text-lg mb-8 max-w-xl">
                    View, edit, and download all your saved resumes in one place.
                  </p>

                  <button
                    onClick={() => navigate("/app")}
                    className="px-8 py-3 rounded-xl bg-black text-white text-lg font-medium hover:bg-gray-800 transition"
                  >
                    View Resumes →
                  </button>
                </div>
              </div>

              {/* Slide 3 */}
              <div className="snap-center min-w-full flex justify-center">
                <div className="w-full max-w-4xl h-[420px] bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center text-center px-10">

                  <h2 className="text-3xl font-semibold mb-3">
                    Resume Samples
                  </h2>

                  <p className="text-gray-600 text-lg mb-8 max-w-xl">
                    Explore professionally written resume samples for different roles.
                  </p>

                  <button
                    onClick={() => navigate("/app/create")}
                    className="px-8 py-3 rounded-xl bg-black text-white text-lg font-medium hover:bg-gray-800 transition"
                  >
                    Browse Samples →
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Swipe or use arrows to explore
        </p>

      </div>
    </PageTransition>
  );
}
