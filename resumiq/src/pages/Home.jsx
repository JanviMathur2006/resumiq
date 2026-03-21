import { useRef, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import PageTransition from "../components/PageTransition";
import { resumeTypes } from "../data/resumeTypes";

/* ICONS */
import {
  FiHome,
  FiFileText,
  FiLayout,
  FiUser,
  FiSettings
} from "react-icons/fi";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

/* FIREBASE */
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

const TOTAL_SLIDES = 3;

export default function Home() {

  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const [activeSlide, setActiveSlide] = useState(0);
  const [userResumes, setUserResumes] = useState([]);
  const [loadingUserResumes, setLoadingUserResumes] = useState(true);
  const [search, setSearch] = useState("");

  const resumeNames = resumeTypes.map((type) => type.name);

  /* ================= SLIDER ================= */

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
    if (activeSlide < TOTAL_SLIDES - 1) {
      scrollToSlide(activeSlide + 1);
    }
  };

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const index = Math.round(
      slider.scrollLeft / slider.offsetWidth
    );
    setActiveSlide(index);
  };

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

  const filteredResumes = userResumes.filter((resume) =>
    (resume.title || "Untitled Resume")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <PageTransition>

      <div className="flex min-h-screen bg-gray-100">

        {/* ================= SIDEBAR ================= */}

        <div className="w-80 bg-[#0f172a] text-white flex flex-col p-8">

          <h2 className="text-3xl font-bold mb-12">Resumiq</h2>

          <nav className="flex flex-col gap-2 text-sm">

            <NavLink to="/app" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800">
              <FiHome size={18} /> Dashboard
            </NavLink>

            <NavLink to="/app/resumes" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800">
              <FiFileText size={18} /> My Resumes
            </NavLink>

            <NavLink to="/app/samples" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800">
              <FiLayout size={18} /> Templates
            </NavLink>

            <div className="border-t border-slate-700 my-6"></div>

            <NavLink to="/app/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800">
              <FiUser size={18} /> Profile
            </NavLink>

            <NavLink to="/app/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800">
              <FiSettings size={18} /> Settings
            </NavLink>

          </nav>
        </div>

        {/* ================= MAIN ================= */}

        <div className="flex-1 px-20 py-10 relative">

          <button
            onClick={() => navigate("/app/create")}
            className="absolute top-10 right-10 bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            + New Resume
          </button>

          <h1 className="text-5xl font-bold mb-4">
            Welcome back 👋
          </h1>

          <h2 className="text-xl text-blue-900 mb-10">
            <Typewriter words={resumeNames} loop={0} cursor />
          </h2>

          {/* ================= SLIDER ================= */}

          <div className="relative">

            {/* LEFT */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow"
            >
              <FaArrowLeft />
            </button>

            {/* RIGHT */}
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white p-3 rounded-full shadow"
            >
              <FaArrowRight />
            </button>

            <div
              ref={sliderRef}
              onScroll={handleScroll}
              className="overflow-x-auto flex snap-x snap-mandatory scroll-smooth"
            >

              {/* SLIDE 1 */}
              <div className="min-w-full flex justify-center snap-center">
                <div className="h-[420px] w-full max-w-4xl bg-white rounded-3xl shadow-xl flex items-center justify-center">
                  <h2 className="text-3xl font-semibold">Create Resume</h2>
                </div>
              </div>

              {/* SLIDE 2 */}
              <div className="min-w-full flex justify-center snap-center">
                <div className="h-[420px] w-full max-w-4xl bg-white rounded-3xl shadow-xl flex items-center justify-center">
                  <h2 className="text-3xl font-semibold">My Resumes ({userResumes.length})</h2>
                </div>
              </div>

              {/* SLIDE 3 */}
              <div className="min-w-full flex justify-center snap-center">
                <div className="h-[420px] w-full max-w-4xl bg-white rounded-3xl shadow-xl flex items-center justify-center">
                  <h2 className="text-3xl font-semibold">Resume Samples</h2>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </PageTransition>
  );
}