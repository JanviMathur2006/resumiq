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

/* 🔥 OVERLAY */
import TransitionOverlay from "./components/TransitionOverlay";

/* ================= PAGE WRAPPER ================= */
function PageWrapper({ children }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
          },
        },
      }}
      style={{ minHeight: "100%" }}
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

      {/* ✅ Overlay stays separate (your original style) */}
      <TransitionOverlay key={location.pathname} />

      <Routes location={location} key={location.pathname}>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/onboarding" element={<PageWrapper><Onboarding /></PageWrapper>} />

        {/* PROTECTED ROUTES */}
        <Route element={<AuthWrapper />}>
          <Route element={<AppLayout />}>

            <Route path="/app" element={<PageWrapper><Home /></PageWrapper>} />

            <Route
              path="/app/choose"
              element={<PageWrapper><ChooseResumeType /></PageWrapper>}
            />

            <Route
              path="/app/resumes"
              element={<PageWrapper><CreateResumes /></PageWrapper>}
            />

            <Route
              path="/app/create"
              element={<PageWrapper><CreateResumes /></PageWrapper>}
            />

            <Route
              path="/app/builder"
              element={<PageWrapper><ResumeBuilder /></PageWrapper>}
            />

            <Route
              path="/app/samples"
              element={<PageWrapper><ResumeSamples /></PageWrapper>}
            />

            <Route
              path="/app/profile"
              element={<PageWrapper><Profile /></PageWrapper>}
            />

            <Route
              path="/app/settings"
              element={<PageWrapper><Settings /></PageWrapper>}
            />

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