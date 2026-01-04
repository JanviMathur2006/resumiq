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

/* =======================
   PROTECTED PAGES
======================= */
import Home from "./pages/Home";
import CreateResumes from "./pages/CreateResumes"; // resume type selection
import ResumeBuilder from "./pages/ResumeBuilder"; // editor
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

/* =======================
   LAYOUT & AUTH
======================= */
import AppLayout from "./components/AppLayout";
import AuthWrapper from "./components/AuthWrapper";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* =======================
            PUBLIC ROUTES
        ======================= */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* =======================
            PROTECTED ROUTES
        ======================= */}
        <Route element={<AuthWrapper />}>
          <Route element={<AppLayout />}>

            {/* Dashboard */}
            <Route path="/app" element={<Home />} />

            {/* Create Resume Flow */}
            <Route path="/app/create" element={<CreateResumes />} />
            <Route path="/app/builder" element={<ResumeBuilder />} />

            {/* User Pages */}
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/app/settings" element={<Settings />} />

          </Route>
        </Route>

        {/* =======================
            FALLBACK
        ======================= */}
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
