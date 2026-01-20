import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

/* =======================
   PUBLIC PAGES
======================= */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";

/* =======================
   PROTECTED PAGES
======================= */
import Home from "./pages/Home";
import CreateResumes from "./pages/CreateResumes";
import ChooseResumeType from "./pages/ChooseResumeType"; // ✅ ADD THIS
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeSamples from "./pages/ResumeSamples";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

/* =======================
   LAYOUT & AUTH
======================= */
import AppLayout from "./components/AppLayout";
import AuthWrapper from "./components/AuthWrapper";

/* =======================
   ANIMATED ROUTES
======================= */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* ================= PROTECTED ================= */}
        <Route element={<AuthWrapper />}>
          <Route element={<AppLayout />}>

            <Route path="/app" element={<Home />} />
            <Route path="/app/create" element={<CreateResumes />} />

            {/* ✅ THIS IS THE FIX */}
            <Route path="/app/choose" element={<ChooseResumeType />} />

            <Route path="/app/builder" element={<ResumeBuilder />} />
            <Route path="/app/samples" element={<ResumeSamples />} />
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/app/settings" element={<Settings />} />

          </Route>
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
