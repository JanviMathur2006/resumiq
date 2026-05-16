import { useRef, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import PageTransition from "../components/PageTransition";
import { resumeTypes } from "../data/resumeTypes";

/* ANIMATION */
import { fadeUp } from "../animations/stagger";

/* ICONS */
import {
  FiHome,
  FiFileText,
  FiLayout,
  FiUser,
  FiSettings
} from "react-icons/fi";

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

  const [isDragging, setIsDragging] = useState(false);

  const [startX, setStartX] = useState(0);

  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const [velocity, setVelocity] = useState(0);

  const resumeNames = resumeTypes.map((type) => type.name);

  /* ================= SLIDER ================= */

  const scrollToSlide = (index) => {

    const slider = sliderRef.current;

    if (!slider) return;

    let newIndex = index;

    if (index < 0) newIndex = TOTAL_SLIDES - 1;

    if (index >= TOTAL_SLIDES) newIndex = 0;

    slider.scrollTo({
      left: newIndex * slider.offsetWidth,
      behavior: "smooth",
    });

    setActiveSlide(newIndex);

  };

  const scrollLeft = () => scrollToSlide(activeSlide - 1);

  const scrollRight = () => scrollToSlide(activeSlide + 1);

  const handleScroll = () => {

    const slider = sliderRef.current;

    if (!slider) return;

    const index = Math.round(
      slider.scrollLeft / slider.offsetWidth
    );

    setActiveSlide(index);

  };

  /* ================= DRAG ================= */

  const handleMouseDown = (e) => {

    const slider = sliderRef.current;

    if (!slider) return;

    setIsDragging(true);

    setStartX(e.pageX - slider.offsetLeft);

    setScrollLeftPos(slider.scrollLeft);

  };

  const handleMouseMove = (e) => {

    if (!isDragging) return;

    const slider = sliderRef.current;

    if (!slider) return;

    const x = e.pageX - slider.offsetLeft;

    const walk = (x - startX) * 1.5;

    setVelocity(walk);

    slider.scrollLeft = scrollLeftPos - walk;

  };

  const handleMouseUp = () => {

    if (!isDragging) return;

    setIsDragging(false);

    const slider = sliderRef.current;

    if (!slider) return;

    const momentum = velocity * 2;

    const finalScroll = slider.scrollLeft - momentum;

    const index = Math.round(finalScroll / slider.offsetWidth);

    scrollToSlide(index);

  };

  const handleTouchStart = (e) => {

    const slider = sliderRef.current;

    if (!slider) return;

    setStartX(e.touches[0].pageX - slider.offsetLeft);

    setScrollLeftPos(slider.scrollLeft);

  };

  const handleTouchMove = (e) => {

    const slider = sliderRef.current;

    if (!slider) return;

    const x = e.touches[0].pageX - slider.offsetLeft;

    const walk = (x - startX) * 1.5;

    setVelocity(walk);

    slider.scrollLeft = scrollLeftPos - walk;

  };

  const handleTouchEnd = () => {

    const slider = sliderRef.current;

    if (!slider) return;

    const momentum = velocity * 2;

    const finalScroll = slider.scrollLeft - momentum;

    const index = Math.round(finalScroll / slider.offsetWidth);

    scrollToSlide(index);

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

      <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">

        {/* BACKGROUND GLOWS */}

        <div className="absolute top-[-180px] left-[-180px] w-[500px] h-[500px] bg-blue-300/40 rounded-full blur-[150px]"></div>

        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[150px]"></div>

        <div className="absolute top-[25%] right-[10%] w-[350px] h-[350px] bg-blue-400/20 rounded-full blur-[140px]"></div>

        <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-indigo-200/20 rounded-full blur-[120px]"></div>

        {/* SIDEBAR */}

        <div className="relative z-10 w-72 bg-[#07122b] text-white flex flex-col p-8 border-r border-slate-800">

          <h2 className="text-4xl font-bold mb-14">
            Resumiq
          </h2>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.06,
                  delayChildren: 0.1,
                },
              },
            }}
          >

            <nav className="flex flex-col gap-3 text-sm">

              {[
                {
                  to: "/app",
                  icon: <FiHome size={18} />,
                  label: "Dashboard"
                },

                {
                  to: "/app/resumes",
                  icon: <FiFileText size={18} />,
                  label: "My Resumes"
                },

                {
                  to: "/app/samples",
                  icon: <FiLayout size={18} />,
                  label: "Templates"
                },

              ].map((item) => (

                <motion.div key={item.to} variants={fadeUp}>

                  <NavLink
                    to={item.to}

                    className={({ isActive }) =>
                      `flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-slate-800 text-blue-400"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>

                </motion.div>

              ))}

              <div className="border-t border-slate-700 my-8"></div>

              {[
                {
                  to: "/app/profile",
                  icon: <FiUser size={18} />,
                  label: "Profile"
                },

                {
                  to: "/app/settings",
                  icon: <FiSettings size={18} />,
                  label: "Settings"
                },

              ].map((item) => (

                <motion.div key={item.to} variants={fadeUp}>

                  <NavLink
                    to={item.to}

                    className={({ isActive }) =>
                      `flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-slate-800 text-blue-400"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>

                </motion.div>

              ))}

            </nav>

          </motion.div>

        </div>

        {/* MAIN */}

        <div className="relative z-10 flex-1 px-10 lg:px-20 py-12 max-w-7xl mx-auto w-full">

          {/* HERO */}

          <motion.div className="mb-14">

            <div className="flex items-start justify-between gap-8 flex-wrap">

              <div>

                <h1
                  className="
                    text-5xl
                    lg:text-6xl
                    leading-tight
                    font-bold
                    text-gray-900
                    mb-4
                    max-w-4xl
                  "
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: "1px"
                  }}
                >
                  Create something remarkable
                </h1>

                <p className="text-gray-600 text-xl mb-5">
                  Craft a resume that reflects your true potential.
                </p>

                <h2 className="text-2xl text-blue-900 font-medium">
                  <Typewriter words={resumeNames} loop={0} cursor />
                </h2>

              </div>

              <button
                onClick={() => navigate("/app/create")}
                className="
                  bg-blue-600
                  text-white
                  px-6
                  py-3
                  rounded-2xl
                  shadow-lg
                  hover:bg-blue-700
                  hover:scale-105
                  transition-all
                  duration-300
                "
              >
                + New Resume
              </button>

            </div>

          </motion.div>

          {/* SLIDER */}

          <div className="relative">

            {/* LEFT BUTTON */}

            <button
              onClick={scrollLeft}

              className="
                flex
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                shadow-xl
                bg-blue-600
                text-white
                z-20
                hover:scale-110
                transition-all
              "
            >
              ←
            </button>

            {/* RIGHT BUTTON */}

            <button
              onClick={scrollRight}

              className="
                flex
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                shadow-xl
                bg-blue-600
                text-white
                z-20
                hover:scale-110
                transition-all
              "
            >
              →
            </button>

            {/* SLIDER CONTENT */}

            <div
              ref={sliderRef}

              onScroll={handleScroll}

              onMouseDown={handleMouseDown}

              onMouseMove={handleMouseMove}

              onMouseUp={handleMouseUp}

              onMouseLeave={handleMouseUp}

              onTouchStart={handleTouchStart}

              onTouchMove={handleTouchMove}

              onTouchEnd={handleTouchEnd}

              className={`
                overflow-x-auto
                snap-x
                snap-mandatory
                scroll-smooth
                scrollbar-hide
                ${isDragging ? "cursor-grabbing" : "cursor-grab"}
              `}
            >

              <div className="flex gap-6">

                {/* CREATE RESUME */}

                <div className="snap-center min-w-full flex justify-center">

                  <Link to="/app/create" className="w-full max-w-5xl">

                    <motion.div
                      whileHover={{ y: -6 }}

                      className="
                        min-h-[280px]
                        rounded-[32px]
                        bg-white/70
                        backdrop-blur-[30px]
                        border
                        border-white/60
                        shadow-[0_25px_80px_rgba(0,0,0,0.10)]
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-center
                        px-10
                      "
                    >

                      <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Create New Resume
                      </h2>

                      <p className="text-lg text-gray-600">
                        Choose from multiple resume categories.
                      </p>

                    </motion.div>

                  </Link>

                </div>

                {/* MY RESUMES */}

                <div className="snap-center min-w-full flex justify-center">

                  <motion.div
                    whileHover={{ y: -6 }}

                    className="
                      w-full
                      max-w-5xl
                      min-h-[280px]
                      rounded-[32px]
                      bg-white/70
                      backdrop-blur-[30px]
                      border
                      border-white/60
                      shadow-[0_25px_80px_rgba(0,0,0,0.10)]
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                      px-10
                    "
                  >

                    <h2 className="text-4xl font-bold mb-3 text-gray-900">
                      My Resumes
                    </h2>

                    <p className="text-gray-500 mb-5 text-lg">
                      {userResumes.length} resumes created
                    </p>

                    <input
                      placeholder="Search resumes..."

                      value={search}

                      onChange={(e) => setSearch(e.target.value)}

                      className="
                        border
                        border-gray-200
                        rounded-2xl
                        px-4
                        py-3
                        w-full
                        max-w-sm
                        mb-5
                        outline-none
                      "
                    />

                    {loadingUserResumes ? (

                      <p className="text-gray-500">
                        Loading…
                      </p>

                    ) : filteredResumes.length === 0 ? (

                      <p className="text-gray-500">
                        You haven't created a resume yet.
                      </p>

                    ) : (

                      <div className="w-full max-w-md flex flex-col gap-3">

                        {filteredResumes.map((resume) => (

                          <div
                            key={resume.id}

                            onClick={() =>
                              navigate(`/app/builder?id=${resume.id}`)
                            }

                            className="
                              border
                              border-gray-200
                              rounded-2xl
                              px-5
                              py-3
                              cursor-pointer
                              hover:bg-gray-50
                              transition
                              text-left
                            "
                          >
                            {resume.title || "Untitled Resume"}
                          </div>

                        ))}

                      </div>

                    )}

                  </motion.div>

                </div>

                {/* TEMPLATES */}

                <div className="snap-center min-w-full flex justify-center">

                  <motion.div
                    onClick={() => navigate("/app/samples")}

                    whileHover={{ y: -6 }}

                    className="
                      w-full
                      max-w-5xl
                      min-h-[280px]
                      rounded-[32px]
                      bg-white/70
                      backdrop-blur-[30px]
                      border
                      border-white/60
                      shadow-[0_25px_80px_rgba(0,0,0,0.10)]
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                      px-10
                      cursor-pointer
                    "
                  >

                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      Resume Samples
                    </h2>

                    <p className="text-lg text-gray-600">
                      Explore recruiter-approved resume examples.
                    </p>

                  </motion.div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </PageTransition>

  );
}