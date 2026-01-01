import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import CreateResume from "./pages/CreateResume";
import Profile from "./pages/Profile";

import AppLayout from "./components/AppLayout";
import AuthWrapper from "./components/AuthWrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route element={<AuthWrapper />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<Home />} />
            <Route path="/app/create" element={<CreateResume />} />
            <Route path="/app/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
