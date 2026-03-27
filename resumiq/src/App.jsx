import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

/* PUBLIC */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";

/* PROTECTED */
import Home from "./pages/Home";
import CreateResumes from "./pages/CreateResumes";
import ChooseResumeType from "./pages/ChooseResumeType";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeSamples from "./pages/ResumeSamples";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

/* LAYOUT */
import AppLayout from "./components/AppLayout";
import AuthWrapper from "./components/AuthWrapper";

/* ================= PAGE WRAPPER (🔥 UPGRADED) ================= */
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.96,
        y: 30,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        scale: 0.96,
        y: -20,
        filter: "blur(8px)",
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        minHeight: "100%",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ================= ROUTES ================= */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* PUBLIC */}
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/onboarding" element={<PageWrapper><Onboarding /></PageWrapper>} />

        {/* PROTECTED */}
        <Route element={<AuthWrapper />}>
          <Route element={<AppLayout />}>

            <Route path="/app" element={<PageWrapper><Home /></PageWrapper>} />

            <Route path="/app/choose" element={<PageWrapper><ChooseResumeType /></PageWrapper>} />

            <Route path="/app/resumes" element={<PageWrapper><CreateResumes /></PageWrapper>} />
            <Route path="/app/create" element={<PageWrapper><CreateResumes /></PageWrapper>} />

            <Route path="/app/builder/:id" element={<PageWrapper><ResumeBuilder /></PageWrapper>} />
            
            <Route path="/app/samples" element={<PageWrapper><ResumeSamples /></PageWrapper>} />
            <Route path="/app/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="/app/settings" element={<PageWrapper><Settings /></PageWrapper>} />

          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
}

/* ================= ROOT ================= */
export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}