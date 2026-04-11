import { useRef, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import PageTransition from "../components/PageTransition";
import { resumeTypes } from "../data/resumeTypes";

/* ✅ NEW */
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

      <div className="flex min-h-screen bg-gray-100">

        {/* SIDEBAR */}
        <div className="w-80 bg-[#0f172a] text-white flex flex-col p-8 border-r border-slate-800">

          <h2 className="text-3xl font-bold mb-12">Resumiq</h2>

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
            <nav className="flex flex-col gap-2 text-sm">

              {[
                { to: "/app", icon: <FiHome size={18} />, label: "Dashboard" },
                { to: "/app/resumes", icon: <FiFileText size={18} />, label: "My Resumes" },
                { to: "/app/samples", icon: <FiLayout size={18} />, label: "Templates" },
              ].map((item) => (
                <motion.div key={item.to} variants={fadeUp}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-item flex items-center gap-3 px-4 py-3 rounded-lg ${
                        isActive
                          ? "bg-slate-800 text-blue-400 active"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`
                    }
                  >
                    {item.icon} {item.label}
                  </NavLink>
                </motion.div>
              ))}

              <div className="border-t border-slate-700 my-6"></div>

              {[
                { to: "/app/profile", icon: <FiUser size={18} />, label: "Profile" },
                { to: "/app/settings", icon: <FiSettings size={18} />, label: "Settings" },
              ].map((item) => (
                <motion.div key={item.to} variants={fadeUp}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-item flex items-center gap-3 px-4 py-3 rounded-lg ${
                        isActive
                          ? "bg-slate-800 text-blue-400 active"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`
                    }
                  >
                    {item.icon} {item.label}
                  </NavLink>
                </motion.div>
              ))}

            </nav>
          </motion.div>

        </div>

        {/* MAIN */}
        <div className="flex-1 px-20 py-10 relative">

          <button
            onClick={() => navigate("/app/create")}
            className="absolute top-10 right-10 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            + New Resume
          </button>

          <motion.div className="mb-12">
            <h1
              className="text-5xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "1px" }}
            >
              Create something remarkable
            </h1>

            <p className="text-gray-600 text-lg mb-4">
              Craft a resume that reflects your true potential.
            </p>

            <h2 className="text-xl text-blue-900">
              <Typewriter words={resumeNames} loop={0} cursor />
            </h2>
          </motion.div>

          {/* SLIDER */}
          <div className="relative">

            <button onClick={scrollLeft} className="flex absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full shadow-lg bg-blue-600 text-white z-10">←</button>

            <button onClick={scrollRight} className="flex absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full shadow-lg bg-blue-600 text-white z-10">→</button>

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
              className={`overflow-x-auto snap-x snap-mandatory scroll-smooth ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            >

              <div className="flex gap-12">

                <div className="snap-center min-w-full flex justify-center">
                  <Link to="/app/create" className="w-full max-w-4xl">
                    <motion.div whileHover={{ y: -6 }} className="h-[420px] bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center text-center px-10">
                      <h2 className="text-3xl font-semibold mb-3">Create New Resume</h2>
                      <p className="text-gray-600">Choose from multiple resume categories.</p>
                    </motion.div>
                  </Link>
                </div>

                <div className="snap-center min-w-full flex justify-center">
                  <motion.div whileHover={{ y: -6 }} className="w-full max-w-4xl h-[420px] bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center text-center px-10">

                    <h2 className="text-3xl font-semibold mb-2">My Resumes</h2>

                    <p className="text-gray-500 mb-4">
                      {userResumes.length} resumes created
                    </p>

                    <input
                      placeholder="Search resumes..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="border rounded-lg px-3 py-2 w-full max-w-sm mb-4"
                    />

                    {loadingUserResumes ? (
                      <p className="text-gray-500">Loading…</p>
                    ) : filteredResumes.length === 0 ? (
                      <p className="text-gray-500">
                        You haven't created a resume yet.
                      </p>
                    ) : (
                      <div className="w-full max-w-md flex flex-col gap-3">
                        {filteredResumes.map((resume) => (
                          <div
                            key={resume.id}
                            onClick={() => navigate(`/app/builder?id=${resume.id}`)}
                            className="border rounded-xl px-4 py-2 cursor-pointer hover:bg-gray-50 transition text-left"
                          >
                            {resume.title || "Untitled Resume"}
                          </div>
                        ))}
                      </div>
                    )}

                  </motion.div>
                </div>

                <div className="snap-center min-w-full flex justify-center">
                  <motion.div onClick={() => navigate("/app/samples")} whileHover={{ y: -6 }} className="w-full max-w-4xl h-[420px] bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center text-center px-10 cursor-pointer">
                    <h2 className="text-3xl font-semibold mb-3">Resume Samples</h2>
                    <p className="text-gray-600">Explore recruiter-approved resume examples.</p>
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