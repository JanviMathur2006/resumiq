import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Protected pages
import Home from "./pages/Home";
import CreateResume from "./pages/CreateResume";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Layout & auth
import AppLayout from "./components/AppLayout";
import AuthWrapper from "./components/AuthWrapper";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES */}
        <Route element={<AuthWrapper />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<Home />} />
            <Route path="/app/create" element={<CreateResume />} />
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/app/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* FALLBACK */}
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
